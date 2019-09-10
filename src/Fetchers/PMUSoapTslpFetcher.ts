import { VarTime } from "../variable_time/VariableTime";
import { ITslpDataPoint, TimePeriod } from "../components/ITimeSeriesLinePlot";
import { SamplingStrategy, Periodicity } from "../measurements/ScadaMeasurement";
import { ITslpDataFetcher } from "./IFetcher";
import { IPMUMeasurement } from "../measurements/PMUMeasurement";
import { spawn, ChildProcess } from "child_process";
import { ipcRenderer } from "electron";
import * as channels from '../channelNames';

/**
 * Assumptions
 * Input data is sorted by time in ascending order
 * The sample rate of input is 25 samples per second = 40 msecs  
 */
export const resampleData = (data: ITslpDataPoint[], sampling_strategy: SamplingStrategy, periodicity: Periodicity): ITslpDataPoint[] => {
    if ((data.length < 2) || (sampling_strategy == SamplingStrategy.Raw)) {
        return data;
    }
    const per_secs = TimePeriod.getSeconds(periodicity);
    const original_sampl_millis = data[1].timestamp - data[0].timestamp;
    if (per_secs < original_sampl_millis * 0.001) {
        return data;
    }
    let newData = [];
    let sampleStep = per_secs * 1000 / original_sampl_millis;
    for (let newSampleIndex = 0; Math.ceil(newSampleIndex * sampleStep) < data.length; newSampleIndex++) {
        const bucketStartInd = Math.ceil(newSampleIndex * sampleStep);
        let bucketEndInd = Math.ceil((newSampleIndex + 1) * sampleStep) - 1;
        if (bucketEndInd >= data.length) {
            bucketEndInd = data.length - 1;
        }
        let newSampleVal = 0;
        let newSampleTimestamp = data[0].timestamp + newSampleIndex * per_secs * 1000;
        if (sampling_strategy == SamplingStrategy.Average) {
            newSampleVal = 0;
            for (let bucInd = bucketStartInd; bucInd <= bucketEndInd; bucInd++) {
                newSampleVal += data[bucInd].value;
            }
            newSampleVal = newSampleVal / (bucketEndInd - bucketStartInd + 1);
        } else if (sampling_strategy == SamplingStrategy.Min) {
            newSampleVal = data[bucketStartInd].value;
            for (let bucInd = bucketStartInd; bucInd <= bucketEndInd; bucInd++) {
                let dataSample = data[bucInd].value
                if (dataSample < newSampleVal) {
                    newSampleVal = dataSample;
                }
            }
        } else if (sampling_strategy == SamplingStrategy.Max) {
            newSampleVal = data[bucketStartInd].value;
            for (let bucInd = bucketStartInd; bucInd <= bucketEndInd; bucInd++) {
                let dataSample = data[bucInd].value
                if (dataSample > newSampleVal) {
                    newSampleVal = dataSample;
                }
            }
        } else {
            newSampleVal = data[bucketStartInd].value;
        }
        newData.push({ timestamp: newSampleTimestamp, value: newSampleVal });
    }
    return newData;
}


export class PMUSoapTslpFetcher implements ITslpDataFetcher {
    host: string = '172.16.183.131';
    port: number = 24721;
    path: string = '/eterra-ws/HistoricalDataProvider';
    username: string = 'pdcAdmin';
    password: string = 'p@ssw0rd';
    refMeasId: number = 2127;

    make2Digits = (num: number): string => {
        if (num <= 9 && num >= 0) {
            return '0' + num;
        }
        return '' + num;
    };

    convertTimeToInpStr = (time: Date): string => {
        const yr = time.getFullYear();
        const mon = this.make2Digits(time.getMonth() + 1);
        const day = this.make2Digits(time.getDate());
        const hr = this.make2Digits(time.getHours());
        const mins = this.make2Digits(time.getMinutes());
        const secs = this.make2Digits(time.getSeconds());
        return `${yr}_${mon}_${day}_${hr}_${mins}_${secs}`;
    };

    getExeRespAsync = (exeName: string, cmdParams: string[]): Promise<string> => {
        return new Promise((resolve, reject) => {
            ipcRenderer.send(channels.getExeData, { exeName: exeName, cmdParams: cmdParams });
            ipcRenderer.once(channels.getExeDataResp, (event, resp: string) => {
                resolve(resp);
            });
        });
    }

    fetchDataFromIpc = async (fromTime: Date, toTime: Date, measId: string): Promise<[number, number][]> => {
        const fromTimeStr = this.convertTimeToInpStr(fromTime);
        const toTimeStr = this.convertTimeToInpStr(toTime);
        const cmdParams: string[] = [
            "--meas_id", measId, "--from_time", fromTimeStr, "--to_time", toTimeStr,
            "--host", this.host, "--port", this.port + '', "--path", this.path,
            "--username", this.username, "--password", this.password, "--ref_meas_id", this.refMeasId + ''
        ];
        const exeName = `CSharp_node_adapter.exe`;
        // meas_id, from_time, to_time, host, port, path, username, password, ref_meas_id
        let data: [number, number][] = [];
        try {
            const resp = await this.getExeRespAsync(exeName, cmdParams);
            if (resp != null && resp != "") {
                data = JSON.parse(resp);
            }
        }
        catch (e) {
            data = [];
        }

        return data;
    }

    async fetchSoapData(pnt: string | number, sampling_strategy: SamplingStrategy, periodicity: Periodicity, fromTime: Date, toTime: Date): Promise<ITslpDataPoint[]> {
        let resultData: ITslpDataPoint[] = [];
        try {
            // todo get the data here
            let resVals: [number, number][] = await this.fetchDataFromIpc(fromTime, toTime, `${pnt}`);

            for (var i = 0; i < resVals.length; i++) {
                let dataPnt: ITslpDataPoint = { timestamp: (new Date(resVals[i][0])).getTime(), value: resVals[i][1] };
                resultData.push(dataPnt);
            }
        }
        catch (err) {
            console.log(`${err.message}`);
            resultData = [];
        }
        resultData = resampleData(resultData, sampling_strategy, periodicity);
        return resultData;
    };

    async fetchData(fromVarTime: VarTime, toVarTime: VarTime, pmu_meas: IPMUMeasurement): Promise<ITslpDataPoint[]> {
        // todo handle fetch window
        let resultData: ITslpDataPoint[] = []
        const fromTime = VarTime.getDateObj(fromVarTime);
        const toTime = VarTime.getDateObj(toVarTime);

        if (fromTime.getTime() >= toTime.getTime()) {
            return resultData;
        }
        const totalFetchMs = (toTime.getTime() - fromTime.getTime());
        const fetchWindowSecs = TimePeriod.getSeconds(pmu_meas.fetchWindow);

        // if fetch window is more than toTime-fromTime, then send data directly
        if (totalFetchMs < fetchWindowSecs || fetchWindowSecs == 0) {
            resultData = await this.fetchSoapData(pmu_meas.meas_id, pmu_meas.sampling_strategy, pmu_meas.periodicity, fromTime, toTime);
            return resultData;
        }

        // calculate the number of fetch windows
        const numFetchWindows: number = Math.ceil(totalFetchMs * 0.001 / fetchWindowSecs);
        let winEndTime = fromTime;
        for (let winInd: number = 0; winInd < numFetchWindows; winInd++) {
            let winStartTime = winEndTime;
            winEndTime = new Date(winStartTime.getTime() + 1000 * fetchWindowSecs);
            if (winEndTime.getTime() > toTime.getTime()) {
                winEndTime = new Date(toTime.getTime());
            }
            let resultDataWindow = await this.fetchSoapData(pmu_meas.meas_id, pmu_meas.sampling_strategy, pmu_meas.periodicity, winStartTime, winEndTime);
            resultData = [...resultData, ...resultDataWindow];
        }

        return resultData;
    }
}
import { VarTime } from "../variable_time/VariableTime";
import { ITslpDataPoint, TimePeriod } from "../components/ITimeSeriesLinePlot";
import { SamplingStrategy, Periodicity, IScadaMeasurement } from "../measurements/ScadaMeasurement";
import { ITslpDataFetcher } from "./IFetcher";
import { ipcRenderer } from "electron";
import * as channels from '../channelNames';

export class DataAdapterTslpFetcher implements ITslpDataFetcher {
    exeName: string = 'ScadaCsharpNodeAdapter.exe';

    make2Digits = (num: number): string => {
        if (num <= 9 && num >= 0) {
            return '0' + num;
        }
        return '' + num;
    };

    convertTimeToInpStr = (time: Date): string => {
        return `${time.getTime()}`;
    };

    getExeRespAsync = (exeName: string, cmdParams: string[]): Promise<string> => {
        return new Promise((resolve, reject) => {
            ipcRenderer.send(channels.getExeData, { exeName: exeName, cmdParams: cmdParams });
            ipcRenderer.once(channels.getExeDataResp, (event, resp: string) => {
                resolve(resp);
            });
        });
    }

    fetchDataFromIpc = async (fromTime: Date, toTime: Date, measId: string, sampling_strategy: SamplingStrategy, periodicity: Periodicity): Promise<number[]> => {
        const fromTimeStr = this.convertTimeToInpStr(fromTime);
        const toTimeStr = this.convertTimeToInpStr(toTime);
        const cmdParams: string[] = [
            "--meas_id", measId, "--from_time", fromTimeStr, "--to_time", toTimeStr,
            "--periodicity", TimePeriod.getSeconds(periodicity) + "", "--request_type", "history",
            "--sampling_strategy", sampling_strategy
        ];
        const exeName = this.exeName;
        // meas_id, from_time, to_time, host, port, path, username, password, ref_meas_id
        let data: number[] = [];
        try {
            const resp = await this.getExeRespAsync(exeName, cmdParams);
            if (resp != null && resp != "") {
                data = resp.split(',').map((num) => { return +num; });
            }
        }
        catch (e) {
            data = [];
        }

        return data;
    }

    async fetchEdnaData(pnt: string | number, sampling_strategy: SamplingStrategy, periodicity: Periodicity, fromTime: Date, toTime: Date): Promise<ITslpDataPoint[]> {
        let resultData: ITslpDataPoint[] = [];
        try {
            let resVals: number[] = await this.fetchDataFromIpc(fromTime, toTime, `${pnt}`, sampling_strategy, periodicity);

            for (var i = 0; i < resVals.length / 2; i++) {
                let pntInd = i * 2;
                let dataPnt: ITslpDataPoint = { timestamp: (new Date(resVals[pntInd])).getTime(), value: resVals[pntInd + 1] };
                resultData.push(dataPnt);
            }
        }
        catch (err) {
            console.log(`${err.message}`);
            resultData = [];
        }
        return resultData;
    };

    async fetchData(fromVarTime: VarTime, toVarTime: VarTime, edna_meas: IScadaMeasurement): Promise<ITslpDataPoint[]> {
        let resultData: ITslpDataPoint[] = []
        const fromTime = VarTime.getDateObj(fromVarTime);
        const toTime = VarTime.getDateObj(toVarTime);

        if (fromTime.getTime() >= toTime.getTime()) {
            return resultData;
        }

        resultData = await this.fetchEdnaData(edna_meas.meas_id, edna_meas.sampling_strategy, edna_meas.periodicity, fromTime, toTime);
        return resultData;
    }
}
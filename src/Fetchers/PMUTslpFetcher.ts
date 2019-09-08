import { VarTime } from "../variable_time/VariableTime";
import { ITslpDataPoint, TimePeriod } from "../components/ITimeSeriesLinePlot";
import { SamplingStrategy, Periodicity } from "../measurements/ScadaMeasurement";
import { ITslpDataFetcher } from "./IFetcher";
import http from 'http';
import { IPMUMeasurement } from "../measurements/PMUMeasurement";

export interface IServerFetchResult {
    statusCode: number,
    json: any
}

function getYearMonthDateStrs(dateObj: Date): string[] {
    var d = new Date(dateObj),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear() + '';

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day];
}

function convertDateObjToMeasDataApiTimeStr(d: Date): string {
    const yearMonthDateStrs = getYearMonthDateStrs(d);
    const y = yearMonthDateStrs[0];
    const mon = yearMonthDateStrs[1];
    const day = yearMonthDateStrs[2];
    var h = addZero(d.getHours(), 2);
    var m = addZero(d.getMinutes(), 2);
    var s = addZero(d.getSeconds(), 2);
    // var ms = addZero(d.getMilliseconds(), 3);
    return day + "_" + mon + "_" + y + "_" + h + "_" + m + "_" + s;
}

function addZero(x: any, n: number) {
    while (x.toString().length < n) {
        x = "0" + x;
    }
    return x;
}

function fetchServerData(post_options, postBody): Promise<IServerFetchResult> {
    return new Promise((resolve, reject) => {
        // Do the request
        let resp_data = '';
        var post_req = http.request(post_options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                // console.log('Response: ' + chunk);
                resp_data += chunk;
            });
            res.on('end', function () {
                // console.log(resp_data);
                resolve({ statusCode: res.statusCode, json: JSON.parse(resp_data) });
            });

        });

        // post the data
        post_req.write(postBody);
        post_req.end();
        post_req.on('error', (err) => {
            // res.send('error: ' + err.message);
            reject(err);
        });
    });
}

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


export class PMUTslpFetcher implements ITslpDataFetcher {
    serverBaseAddress: string = '172.16.184.35';
    serverPort: number = 50100;
    serverPath: string = '/api/meas_data';
    async fetchServerData(pnt: string | number, sampling_strategy: SamplingStrategy, periodicity: Periodicity, fromTime: Date, toTime: Date): Promise<ITslpDataPoint[]> {
        let resultData: ITslpDataPoint[] = [];
        const post_options = {
            host: this.serverBaseAddress,
            port: this.serverPort,
            path: this.serverPath,
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        };

        const postBody = require('querystring').stringify({
            "ids[]": [pnt],
            "from_time": convertDateObjToMeasDataApiTimeStr(fromTime),
            "to_time": convertDateObjToMeasDataApiTimeStr(toTime)
        });

        try {
            let pointsArray = await fetchServerData(post_options, postBody);
            const dataValsDict = pointsArray['json'].data;

            let timestamps = dataValsDict['time'];
            let dataVals = dataValsDict[pnt];

            for (var i = 0; i < timestamps.length; i++) {
                let dataPnt: ITslpDataPoint = { timestamp: (new Date(timestamps[i])).getTime(), value: parseFloat(dataVals[i]) };
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
            resultData = await this.fetchServerData(pmu_meas.meas_id, pmu_meas.sampling_strategy, pmu_meas.periodicity, fromTime, toTime);
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
            let resultDataWindow = await this.fetchServerData(pmu_meas.meas_id, pmu_meas.sampling_strategy, pmu_meas.periodicity, winStartTime, winEndTime);
            resultData = [...resultData, ...resultDataWindow];
        }

        return resultData;
    }
}
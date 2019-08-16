import { VarTime } from "../variable_time/VariableTime";
import { ITslpDataPoint, TimePeriod } from "../components/ITimeSeriesLinePlot";
import { IScadaMeasurement, SamplingStrategy, Periodicity } from "../measurements/ScadaMeasurement";
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


export class PMUTslpFetcher implements ITslpDataFetcher {
    serverBaseAddress: string = '172.16.184.35';
    serverPort: string = '50100';
    apiPath: string = '/api/meas_data';
    async fetchServerData(pnt: string | number, fetch_strategy: SamplingStrategy, periodicity: Periodicity, fromVarTime: VarTime, toVarTime: VarTime): Promise<ITslpDataPoint[]> {
        let resultData: ITslpDataPoint[] = [];
        let serverBaseAddress: string = this.serverBaseAddress;
        const fromTime: Date = VarTime.getDateObj(fromVarTime);
        const toTime: Date = VarTime.getDateObj(toVarTime);

        var post_options = {
            host: serverBaseAddress,
            port: this.serverPort,
            path: this.apiPath,
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
        return resultData;
    };

    async fetchData(fromVarTime: VarTime, toVarTime: VarTime, pmu_meas: IPMUMeasurement): Promise<ITslpDataPoint[]> {
        // todo handle fetch window
        let resultData: ITslpDataPoint[] = await this.fetchServerData(pmu_meas.meas_id, pmu_meas.sampling_strategy, pmu_meas.periodicity, fromVarTime, toVarTime);
        return resultData;
    }
}
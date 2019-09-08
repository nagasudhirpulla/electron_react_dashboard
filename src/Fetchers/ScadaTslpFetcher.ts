import { VarTime } from "../variable_time/VariableTime";
import { ITslpDataPoint, TslpDataPointQuality, TimePeriod } from "../components/ITimeSeriesLinePlot";
import { IScadaMeasurement, SamplingStrategy, Periodicity } from "../measurements/ScadaMeasurement";
import { ITslpDataFetcher } from "./IFetcher";

export interface IScadaApiFetchPnt {
    dval: string,
    timestamp: string,
    status: string
}

export interface IGetJSONResult {
    statusCode: string,
    json: any
}

export class ScadaTslpFetcher implements ITslpDataFetcher {
    serverBaseAddress: string;
    serverPath: string;
    serverPort: number;
    getJSON(options): Promise<IGetJSONResult> {
        return new Promise((resolve, reject) => {
            console.log('rest::getJSON');
            let output = '';
            const http = require('http');
            const req = http.request(options, (res) => {
                console.log(`${options.hostname} : ${res.statusCode}`);
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    output += chunk;
                });
                res.on('end', () => {
                    let obj = JSON.parse(output);
                    resolve({ statusCode: res.statusCode, json: obj });
                });
            });
            req.on('error', (err) => {
                // res.send('error: ' + err.message);
                reject(err);
            });
            req.end();
        });
    };

    ensureTwoDigits(num: number): string {
        if (num >= 0 && num <= 9) {
            return "0" + num;
        }
        return "" + num;
    };

    getApiTimeString(timeObj: Date): string {
        // "dd/MM/yyyy/HH:mm:ss"
        let timeStr = `${this.ensureTwoDigits(timeObj.getDate())}/${this.ensureTwoDigits(timeObj.getMonth())}/${timeObj.getFullYear()}/${this.ensureTwoDigits(timeObj.getHours())}:${this.ensureTwoDigits(timeObj.getMinutes())}:${this.ensureTwoDigits(timeObj.getSeconds())}`;
        return timeStr;
    };

    createApiFetchPath(pnt: string | number, fetch_strategy: SamplingStrategy, periodicity: Periodicity, fromTime: Date, toTime: Date): string {
        var fromTimeStr = this.getApiTimeString(fromTime);
        var toTimeStr = this.getApiTimeString(toTime);
        var secs = TimePeriod.getSeconds(periodicity);
        var url = "";
        // api/values/history?type=snap&pnt=something&strtime=30/11/2016/00:00:00&endtime=30/11/2016/23:59:00&secs=60
        url = `${this.serverPath}/api/values/history?type=${fetch_strategy}&pnt=${pnt}&strtime=${fromTimeStr}&endtime=${toTimeStr}&secs=${secs}`;
        return url;
    };

    async fetchServerData(pnt: string | number, fetch_strategy: SamplingStrategy, periodicity: Periodicity, fromVarTime: VarTime, toVarTime: VarTime): Promise<ITslpDataPoint[]> {
        let resultData: ITslpDataPoint[] = [];
        const serverBaseAddress: string = this.serverBaseAddress;
        const serverPort: number = this.serverPort;
        const fromTime: Date = VarTime.getDateObj(fromVarTime);
        const toTime: Date = VarTime.getDateObj(toVarTime);
        // perform api call to service
        const fetchPath = this.createApiFetchPath(pnt, fetch_strategy, periodicity, fromTime, toTime);
        const options = {
            hostname: serverBaseAddress,
            port: serverPort,
            path: fetchPath,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            let pointsArray = await this.getJSON(options);
            for (var i = 0; i < pointsArray['json'].length; i++) {
                const fetchPnt: IScadaApiFetchPnt = pointsArray['json'][i] as IScadaApiFetchPnt
                const val = fetchPnt.dval;
                const timestamp = fetchPnt.timestamp;
                const quality: string = fetchPnt.status;
                let pntQuality: TslpDataPointQuality = TslpDataPointQuality.Good;
                if (quality.toLowerCase() != "good" || quality.toLowerCase() != "ok") {
                    pntQuality = TslpDataPointQuality.Bad;
                }
                let dataPnt: ITslpDataPoint = { timestamp: (new Date(timestamp)).getTime(), value: parseInt(val), quality: pntQuality };
                resultData.push(dataPnt);
            }
        }
        catch (err) {
            console.log(`${err.message}`);
            resultData = [];
        }
        return resultData;
    };

    async fetchData(fromVarTime: VarTime, toVarTime: VarTime, scada_meas: IScadaMeasurement): Promise<ITslpDataPoint[]> {
        const resultData: ITslpDataPoint[] = await this.fetchServerData(scada_meas.meas_id, scada_meas.sampling_strategy, scada_meas.periodicity, fromVarTime, toVarTime);
        return resultData;
    }
}

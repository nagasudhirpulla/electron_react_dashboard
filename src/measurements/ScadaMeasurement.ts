import { IMeasurement } from "./IMeasurement";
import { VarTime } from "../variable_time/VariableTime";
import { ITslpDataPoint, ITimePeriod, TslpDataPointQuality } from "../components/ITimeSeriesLinePlot";
export class Periodicity implements ITimePeriod {
    years = 0;
    months = 0;
    days = 0;
    hrs = 0;
    mins = 0;
    secs = 60;
    millis = 0;
    getSeconds(): number {
        return this.years * 365 * 30 * 24 * 60 * 60 + this.months * 30 * 24 * 60 * 60 + this.days * 24 * 60 * 60 + this.hrs * 60 * 60 + this.mins * 60 + this.secs + this.millis * 0.001;
    }
}

export enum FetchStrategy {
    Raw = "raw",
    Snap = "snap",
    Average = "average",
    Max = "max",
    Min = "min",
    Interpolated = "interpolated",
}

function getJSON(options) {
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

function ensureTwoDigits(num: number): string {
    if (num >= 0 && num <= 9) {
        return "0" + num;
    }
    return "" + num;
}

function getApiTimeString(timeObj: Date): string {
    // "dd/MM/yyyy/HH:mm:ss"
    let timeStr = `${ensureTwoDigits(timeObj.getDate())}/${ensureTwoDigits(timeObj.getMonth())}/${timeObj.getFullYear()}/${ensureTwoDigits(timeObj.getHours())}:${ensureTwoDigits(timeObj.getMinutes())}:${ensureTwoDigits(timeObj.getSeconds())}`;
    return timeStr;
}

function createApiFetchPath(pnt: string | number, fetch_strategy: FetchStrategy, periodicity: Periodicity, fromTime: Date, toTime: Date): string {
    var fromTimeStr = getApiTimeString(fromTime);
    var toTimeStr = getApiTimeString(toTime);
    var secs = periodicity.getSeconds();
    var url = "";
    // api/values/history?type=snap&pnt=something&strtime=30/11/2016/00:00:00&endtime=30/11/2016/23:59:00&secs=60
    url = `/api/values/history?type=${fetch_strategy}&pnt=${pnt}&strtime=${fromTimeStr}&endtime=${toTimeStr}&secs=${secs}`;
    return url;
}

async function fetchData(pnt: string | number, fetch_strategy: FetchStrategy, periodicity: Periodicity, fromVarTime: VarTime, toVarTime: VarTime): Promise<ITslpDataPoint[]> {
    let resultData: ITslpDataPoint[] = [];
    let serverBaseAddress: string = "wmrm0mc1";
    const fromTime: Date = fromVarTime.getDateObj();
    const toTime: Date = toVarTime.getDateObj();
    // do the api call to service
    let fetchPath = createApiFetchPath(pnt, fetch_strategy, periodicity, fromTime, toTime);
    const options = {
        hostname: serverBaseAddress,
        port: 62448,
        path: fetchPath,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        let pointsArray = await getJSON(options);
        for (var i = 0; i < pointsArray['json'].length; i++) {
            const val = pointsArray['json'][i].dval;
            const timstamp = pointsArray['json'][i].timestamp;
            const quality: string = pointsArray['json'][i].status;
            let pntQuality: TslpDataPointQuality = TslpDataPointQuality.Good;
            if (quality.toLowerCase() != "good" || quality.toLowerCase() != "ok") {
                pntQuality = TslpDataPointQuality.Bad;
            }
            let dataPnt: ITslpDataPoint = { timestamp: new Date(timstamp), value: parseInt(val), quality: pntQuality };
            resultData.push(dataPnt);
        }
    } catch (err) {
        console.log(`${err.message}`);
        resultData = [];
    }
    return resultData;
}

export class ScadaMeasurement implements IMeasurement {
    meas_id: string | number = "WRLDCMP.SCADA1.A0015067";
    fetch_strategy: FetchStrategy = FetchStrategy.Snap;
    periodicity: Periodicity = new Periodicity();

    async fetchData(fromVarTime: VarTime, toVarTime: VarTime): Promise<ITslpDataPoint[]> {
        // get data
        let resultData: ITslpDataPoint[] = await fetchData(this.meas_id, this.fetch_strategy, this.periodicity, fromVarTime, toVarTime);
        return resultData;
    }
}

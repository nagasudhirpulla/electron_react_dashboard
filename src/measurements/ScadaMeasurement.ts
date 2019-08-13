import { IMeasurement } from "./IMeasurement";
import { VarTime } from "../variable_time/VariableTime";
import { ITslpDataPoint, ITimePeriod } from "../components/ITimeSeriesLinePlot";

export class Periodicity implements ITimePeriod {
    years = 0;
    months = 0;
    days = 0;
    hrs = 0;
    mins = 0;
    secs = 0;
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

function ensureTwoDigits(num: number): string {
    if (num >= 0 && num <= 9) {
        return "0" + num;
    }
    return "" + num;
}

function getApiTimeString(timeObj: Date): string {
    let timeStr = ""
    // "dd/MM/yyyy/HH:mm:ss"
    timeStr = `${ensureTwoDigits(timeObj.getDate())}/${ensureTwoDigits(timeObj.getMonth())}/${timeObj.getFullYear()}/${ensureTwoDigits(timeObj.getHours())}:${ensureTwoDigits(timeObj.getMinutes())}:${ensureTwoDigits(timeObj.getSeconds())}}`;
    return timeStr;
}

function createApiFetchUrl(serverBaseAddress: string, pnt: string | number, fetch_strategy: FetchStrategy, periodicity: Periodicity, fromTime: Date, toTime: Date): string {
    var fromTimeStr = getApiTimeString(fromTime);
    var toTimeStr = getApiTimeString(toTime);
    var secs = periodicity.getSeconds();
    var url = "";
    // api/values/history?type=snap&pnt=something&strtime=30/11/2016/00:00:00&endtime=30/11/2016/23:59:00&secs=60
    url = `${serverBaseAddress}/api/values/history?type=${fetch_strategy}&pnt=${pnt}&strtime=${fromTimeStr}&endtime=${toTimeStr}&secs=${secs}`;
    return url;
}

function fetchData(pnt: string | number, fetch_strategy: FetchStrategy, periodicity: Periodicity, fromVarTime: VarTime, toVarTime: VarTime): ITslpDataPoint[] {
    let resultData: ITslpDataPoint[] = [];
    let serverBaseAddress: string = "http://localhost:5000";
    const fromTime:Date = fromVarTime.getDateObj();
    const toTime:Date = toVarTime.getDateObj();
    // do the api call to service
    let fetchUrl = createApiFetchUrl(serverBaseAddress, pnt, fetch_strategy, periodicity, fromTime, toTime);

    return resultData;
}

export class ScadaMeasurement implements IMeasurement {
    meas_id: string | number = "";
    fetch_strategy: FetchStrategy = FetchStrategy.Raw;
    periodicity: Periodicity = new Periodicity();

    fetchData(fromVarTime: VarTime, toVarTime: VarTime): ITslpDataPoint[] {
        // get data
        let resultData: ITslpDataPoint[] = fetchData(this.meas_id, this.fetch_strategy, this.periodicity, fromVarTime, toVarTime);
        return resultData;
    }
}

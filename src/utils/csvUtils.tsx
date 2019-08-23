import { ITslpDataPoint } from "../components/ITimeSeriesLinePlot";

const ensureTwoDigits = (num: number): string => {
    if (num < 10 && num > -1) {
        return `0${num}`;
    }
    return "" + num;
};

const ensureThreeMilliDigits = (num: number): string => {
    if (num <= 9 && num >= 0) {
        return `${num}00`;
    } else if (num <= 99 && num >= 10) {
        return `${num}0`;
    }
    return "" + num;
};

const timeStampToExportStr = (ts: number): string => {
    const dateObj = new Date(ts);
    const timeStr = `${dateObj.getFullYear()}-${ensureTwoDigits(dateObj.getMonth() + 1)}-${ensureTwoDigits(dateObj.getDate())} ${ensureTwoDigits(dateObj.getHours())}:${ensureTwoDigits(dateObj.getMinutes())}:${ensureTwoDigits(dateObj.getSeconds())}.${ensureThreeMilliDigits(dateObj.getMilliseconds())}`;
    return timeStr;
};

export const getCsvStringFromITslpDataPoints = (dataArray: ITslpDataPoint[][]) => {
    const csvData: string[][] = [];
    for (let seriesIter = 0; seriesIter < dataArray.length; seriesIter++) {
        const seriesData = dataArray[seriesIter];
        let seriesTimeStrs = [`Time_${seriesIter}`];
        let seriesValueStrs = [`${seriesIter}`];
        for (let pntIter = 0; pntIter < seriesData.length; pntIter++) {
            const pnt = seriesData[pntIter];
            seriesTimeStrs.push(timeStampToExportStr(pnt.timestamp));
            seriesValueStrs.push("" + Math.round(pnt.value * 1000) * 0.001);
        }
        csvData.push(seriesTimeStrs);
        csvData.push(seriesValueStrs);
    }
};
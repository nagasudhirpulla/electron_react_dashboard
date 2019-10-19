import { ITslpDataPoint } from "../components/ITimeSeriesLinePlot";

export const convertToDurationPnts = (pnts: ITslpDataPoint[]): ITslpDataPoint[] => {
    // derive the values
    let vals: number[] = [];
    for (let pntInd = 0; pntInd < pnts.length; pntInd++) {
        vals.push(pnts[pntInd].value);
    }

    // get duration plot data from values
    const durationPnts = getDurationData(vals, null);

    // return duration data
    return durationPnts;
};

export const getDurationData = (vals: number[], resol: number): ITslpDataPoint[] => {
    const minVal = Math.min(...vals);
    const maxVal = Math.max(...vals);
    const numVals = vals.length;

    // determine bins resolution if not provided
    let valsResol = resol;
    const defResolDivider = 1000;
    if (resol == null) {
        valsResol = (maxVal - minVal) / defResolDivider;
    }
    if (valsResol == 0) {
        valsResol = 0.001;
    }

    // determine the results
    let results: ITslpDataPoint[] = []
    for (let binVal = minVal; binVal <= maxVal; binVal = binVal + valsResol) {
        // find the percentage number of values that exceed the binVal
        let countExceeded = 0;
        for (let valIter = 0; valIter < vals.length; valIter++) {
            const val = vals[valIter];
            if (val > binVal) {
                countExceeded += 1;
            }
        }
        const percExceeded = countExceeded * 100 / numVals;
        results.push({ timestamp: percExceeded, value: binVal });
    }

    //return the results
    return results;
};
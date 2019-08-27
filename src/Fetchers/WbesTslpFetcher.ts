import { ITslpDataFetcher } from "./IFetcher";
import { VarTime } from "../variable_time/VariableTime";
import { ITslpDataPoint } from "../components/ITimeSeriesLinePlot";
import { getSchForDates } from "../utils/wbesUtils";
import { IWbesMeasurement } from "../measurements/WbesMeasurement";
import { resampleData } from "./PMUTslpFetcher";

export class WbesTslpFetcher implements ITslpDataFetcher {
    async fetchData(fromVarTime: VarTime, toVarTime: VarTime, meas: IWbesMeasurement): Promise<ITslpDataPoint[]> {
        const fromTime = VarTime.getDateObj(fromVarTime);
        const toTime = VarTime.getDateObj(toVarTime);
        const vals = await getSchForDates(fromTime, toTime, -1, meas.meas_id, meas.schType);
        if (vals == []) {
            return [];
        }
        // the values returned are of 15 mins freq, so generate timestamps accordingly
        let samplesStartTime = fromTime;
        samplesStartTime.setHours(0);
        samplesStartTime.setMinutes(0);
        samplesStartTime.setSeconds(0);
        samplesStartTime.setMilliseconds(0);
        let resVals: ITslpDataPoint[] = []
        for (let sampleInd = 0; sampleInd <= vals.length; sampleInd++) {
            resVals.push(
                {
                    timestamp: samplesStartTime.getTime() + 15 * 60 * 1000 * sampleInd,
                    value: vals[sampleInd]
                }
            );

        }
        resVals = resampleData(resVals, meas.sampling_strategy, meas.periodicity);
        return resVals;
    }
}
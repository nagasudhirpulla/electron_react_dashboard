import { VarTime } from "../variable_time/VariableTime";
import { IMeasurement } from "../measurements/IMeasurement";
import { ITslpDataPoint, TimePeriod } from "../components/ITimeSeriesLinePlot";
import { ITslpDataFetcher } from "./IFetcher";
import { Periodicity } from "../measurements/ScadaMeasurement";
import { IDummyMeasurement } from "../measurements/DummyMeasurement";
export class DummyTslpFetcher implements ITslpDataFetcher {
    async fetchData(fromVarTime: VarTime, toVarTime: VarTime, meas: IDummyMeasurement): Promise<ITslpDataPoint[]> {
        // Initialize results
        let resultData: ITslpDataPoint[] = [];
        let fromTime: Date = VarTime.getDateObj(fromVarTime);
        let toTime: Date = VarTime.getDateObj(toVarTime);
        let periodicityMillis: number = TimePeriod.getSeconds(meas.periodicity) * 1000;
        
        // Generate random values as per periodicity
        for (let currTime: Date = new Date(fromTime.getTime()); currTime.getTime() <= toTime.getTime(); currTime = new Date(currTime.getTime() + periodicityMillis)) {
            let timeStamp = currTime.getTime();
            let val = Math.random() * 10;
            let pnt: ITslpDataPoint = { timestamp: timeStamp, value: val };
            resultData.push(pnt);
        }
        return resultData;
    }
}

import { VarTime } from "../variable_time/VariableTime";
import { IMeasurement } from "../measurements/IMeasurement";
import { ITslpDataPoint } from "../components/ITimeSeriesLinePlot";
import { ITslpDataFetcher } from "./IFetcher";
export class DummyTslpFetcher implements ITslpDataFetcher {
    async fetchData(fromVarTime: VarTime, toVarTime: VarTime, meas: IMeasurement): Promise<ITslpDataPoint[]> {
        // Initialise results
        let resultData: ITslpDataPoint[] = [];
        let fromTime: Date = VarTime.getDateObj(fromVarTime);
        let toTime: Date = VarTime.getDateObj(toVarTime);
        // Generate random values minute-wise
        for (let currTime: Date = new Date(fromTime.getTime()); currTime.getTime() <= toTime.getTime(); currTime = new Date(currTime.getTime() + 60000)) {
            let timeStamp = currTime.getTime();
            let val = Math.random() * 10;
            let pnt: ITslpDataPoint = { timestamp: timeStamp, value: val };
            resultData.push(pnt);
        }
        return resultData;
    }
}

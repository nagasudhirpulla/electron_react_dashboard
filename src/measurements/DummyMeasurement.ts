import { IMeasurement } from "./IMeasurement";
import { VarTime } from "../variable_time/VariableTime";
import { TslpDataPoint, TslpDataPointQuality } from "../components/ITimeSeriesLinePlot";

export class DummyMeasurement implements IMeasurement {
    meas_id: string | number = "";

    fetchData(fromVarTime: VarTime, toVarTime: VarTime): TslpDataPoint[] {
        // Initialise results
        let resultData: TslpDataPoint[] = [];

        let fromTime: Date = fromVarTime.getDateObj();
        let toTime: Date = toVarTime.getDateObj();

        // Generate random values minute-wise
        for (let currTime: Date = new Date(fromTime.getTime()); currTime.getTime() <= toTime.getTime(); currTime = new Date(currTime.getTime() + 60000)) {
            let timeStamp = new Date(currTime.getTime())
            let val = Math.random() * 10
            let pnt: TslpDataPoint = { timestamp: timeStamp, value: val }
            resultData.push(pnt)
        }

        return resultData;
    }
}
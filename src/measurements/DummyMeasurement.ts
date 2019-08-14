import { IMeasurement } from "./IMeasurement";
import { VarTime } from "../variable_time/VariableTime";
import { ITslpDataPoint, TslpDataPointQuality } from "../components/ITimeSeriesLinePlot";

export class DummyMeasurement implements IMeasurement {
    static typename: string = 'DummyMeasurement';
    discriminator: string = DummyMeasurement.typename;
    meas_id: string | number = "";
}


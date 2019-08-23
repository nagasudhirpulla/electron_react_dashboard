import { IMeasurement } from "./IMeasurement";
import { VarTime } from "../variable_time/VariableTime";
import { ITslpDataPoint, TslpDataPointQuality } from "../components/ITimeSeriesLinePlot";
import { Periodicity } from "./ScadaMeasurement";

export interface IDummyMeasurement extends IMeasurement {
    periodicity: Periodicity
}

export class DummyMeasurement implements IDummyMeasurement {
    static typename: string = 'DummyMeasurement';
    discriminator: string = DummyMeasurement.typename;
    meas_id: string | number = "dummy";
    periodicity: Periodicity = new Periodicity();
}


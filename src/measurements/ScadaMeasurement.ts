import { IMeasurement } from "./IMeasurement";
// import { VarTime } from "../variable_time/VariableTime";
import { ITimePeriod } from "../components/ITimeSeriesLinePlot";
export class Periodicity implements ITimePeriod {
    years = 0;
    months = 0;
    days = 0;
    hrs = 0;
    mins = 0;
    secs = 60;
    millis = 0;
}

export enum SamplingStrategy {
    Raw = "raw",
    Snap = "snap",
    Average = "average",
    Max = "max",
    Min = "min",
    Interpolated = "interpolated",
}

export interface IScadaMeasurement extends IMeasurement {
    sampling_strategy: SamplingStrategy,
    periodicity: Periodicity,
};

export class ScadaMeasurement implements IScadaMeasurement {
    static typename: string = "ScadaMeasurement"
    discriminator: string = ScadaMeasurement.typename;
    meas_id: string | number = "WRLDCMP.SCADA1.A0015067";
    sampling_strategy: SamplingStrategy = SamplingStrategy.Snap;
    periodicity: Periodicity = new Periodicity();
};

import { IMeasurement } from "./IMeasurement";
import { SamplingStrategy, Periodicity } from "./ScadaMeasurement";
import { TimePeriod } from "../components/ITimeSeriesLinePlot";

export interface IPMUMeasurement extends IMeasurement {
    sampling_strategy: SamplingStrategy,
    periodicity: Periodicity,
    fetchWindow:TimePeriod
};

export class PMUMeasurement implements IPMUMeasurement {
    fetchWindow: TimePeriod = new TimePeriod();
    static typename: string = "PMUMeasurement";
    discriminator: string = PMUMeasurement.typename;
    meas_id: string | number = "13206";
    sampling_strategy: SamplingStrategy = SamplingStrategy.Raw;
    periodicity: Periodicity = new Periodicity();
}

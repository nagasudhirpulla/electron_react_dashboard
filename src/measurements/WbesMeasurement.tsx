import { IMeasurement } from "./IMeasurement";
import { SamplingStrategy, Periodicity } from "./ScadaMeasurement";
import { TimePeriod } from "../components/ITimeSeriesLinePlot";

export enum SchType {
    OnBarDc = "OnBarDc",
    OffBarDc = "OffBarDc",
    TotalDc = "TotalDc",
    NetSch = "NetSch",
    Isgs = "Isgs",
    Mtoa = "Mtoa",
    Stoa = "Stoa",
    Lta = "Lta",
    Iex = "Iex",
    Px = "Px",
    Urs = "Urs",
    Rras = "Rras",
    Sced = "Sced"
}
export interface IWbesMeasurement extends IMeasurement {
    meas_id: string,
    schType: SchType,
    sampling_strategy: SamplingStrategy,
    periodicity: Periodicity
};

export class WbesMeasurement implements IWbesMeasurement {
    schType: SchType = SchType.OnBarDc;
    static typename: string = "WbesMeasurement"
    discriminator: string = WbesMeasurement.typename;
    meas_id: string = "6477e23c-660e-4587-92d2-8e3488bc8262";
    sampling_strategy: SamplingStrategy = SamplingStrategy.Raw;
    periodicity: Periodicity = new Periodicity();
};
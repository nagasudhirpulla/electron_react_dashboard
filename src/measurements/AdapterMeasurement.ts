import { IMeasurement } from "./IMeasurement";

export interface IAdapterMeasurement extends IMeasurement {
    meas_id: string,
    adapter_id: string
};

export class AdapterMeasurement implements IAdapterMeasurement {
    static typename: string = "AdapterMeasurement"
    discriminator: string = AdapterMeasurement.typename;
    meas_id: string = "MeasId";
    adapter_id: string = "";
};
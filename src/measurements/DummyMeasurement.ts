import { IMeasurement } from "./IMeasurement";
import { Periodicity } from "./ScadaMeasurement";

export interface IDummyMeasurement extends IMeasurement {
    value1:number,
    value2:number
    periodicity: Periodicity
}

export class DummyMeasurement implements IDummyMeasurement {
    value1: number = 0;
    value2: number = 10;
    static typename: string = 'DummyMeasurement';
    discriminator: string = DummyMeasurement.typename;
    meas_id: string | number = "dummy";
    periodicity: Periodicity = new Periodicity();
}


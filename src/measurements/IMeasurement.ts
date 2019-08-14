import { ITslpDataPoint } from "../components/ITimeSeriesLinePlot";
import { VarTime } from "../variable_time/VariableTime";

export interface IMeasurement {
    discriminator: string;
    meas_id: string | number;
};
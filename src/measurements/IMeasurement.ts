import { ITslpDataPoint } from "../components/ITimeSeriesLinePlot";
import { VarTime } from "../variable_time/VariableTime";

export interface IMeasurement {
    meas_id: string | number;
    fetchData(fromVarTime: VarTime, toVarTime: VarTime): ITslpDataPoint[];
};
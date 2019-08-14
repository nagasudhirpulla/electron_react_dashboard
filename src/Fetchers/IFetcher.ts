import { VarTime } from "../variable_time/VariableTime";

import { IMeasurement } from "../measurements/IMeasurement";

import { ITslpDataPoint } from "../components/ITimeSeriesLinePlot";

export interface ITslpDataFetcher {
    fetchData(fromVarTime: VarTime, toVarTime: VarTime, meas: IMeasurement): Promise<ITslpDataPoint[]>;
}
import { Color } from "plotly.js";
import { IMeasurement } from "../measurements/IMeasurement";
import { VarTime } from './../variable_time/VariableTime';
import { IDashWidgetContentState, IDashWidgetContentProps } from "./IDashWidgetContent";
import { ScadaMeasurement } from "../measurements/ScadaMeasurement";
import { ITimePeriod, DisplayTimeShift } from "./ITimeSeriesLinePlot";

export interface ITsscProps extends IDashWidgetContentProps {
    seriesList: ITsscSeriesProps[],
    backgroundColor: Color,
    titleColor: Color,
    title: string
}

export class TsscProps implements ITsscProps {
    static typename: string = 'TsscProps';
    discriminator: string = TsscProps.typename;
    seriesList: ITsscSeriesProps[] = [];
    backgroundColor: Color = "white";
    titleColor: Color = "black";
    title: string = "Timeseries Scatter Plot";
}

export interface ITsscState extends IDashWidgetContentState {
    seriesList: ITsscSeriesState[],
    backgroundColor: Color,
    titleColor: Color,
    title: string,
    mounted: boolean
}

export interface ITsscSeriesState extends ITsscSeriesProps {

}

export interface ITsscSeriesProps {
    title: string,
    color: Color,
    size: number,
    meas1: IMeasurement,
    meas2: IMeasurement,
    fromVarTime: VarTime,
    toVarTime: VarTime,
    displayTimeShift: ITimePeriod,
    renderStrategy: PlotlyRenderStrategy,
    points: ITsscDataPoint[]
}

export class TsscSeriesProps implements ITsscSeriesProps {
    renderStrategy = PlotlyRenderStrategy.scatter;
    title: string = "Series Name";
    color: Color = "blue";
    size: number = 3;
    meas1: IMeasurement = new ScadaMeasurement()
    meas2: IMeasurement = new ScadaMeasurement()
    fromVarTime: VarTime = new VarTime();
    toVarTime: VarTime = new VarTime();
    displayTimeShift: ITimePeriod = new DisplayTimeShift();
    points: ITsscDataPoint[] = []
}

export interface ITsscDataPoint {
    timestamp: number,
    value1: number,
    value2: number,
}

export enum PlotlyRenderStrategy {
    scatter = "scatter",
    scattergl = "scattergl"
}
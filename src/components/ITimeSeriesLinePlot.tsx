import { Color, Datum, Data, Layout } from "plotly.js";
import { IMeasurement } from "../measurements/IMeasurement";
import { VarTime } from './../variable_time/VariableTime';
import { IDashWidgetContentState, IDashWidgetContentProps } from "./IDashWidgetContent";
import { ScadaMeasurement } from "../measurements/ScadaMeasurement";

export interface ITslpProps extends IDashWidgetContentProps {
    seriesList: ITslpSeriesProps[],
    backgroundColor: Color,
    titleColor: Color,
    title: string,
    showGrid: boolean
}

export class TslpProps implements ITslpProps {
    static typename: string = 'TslpProps';
    discriminator: string = TslpProps.typename;
    border: string = "1px solid lightgray";
    seriesList: ITslpSeriesProps[] = [];
    backgroundColor: Color = "white";
    titleColor: Color = "black";
    title: string = "Timeseries Plot";
    showGrid: boolean = true;
}

export interface ITslpState extends IDashWidgetContentState {
    seriesList: ITslpSeriesState[],
    backgroundColor: Color,
    titleColor: Color,
    title: string,
    showGrid: boolean,
    mounted: boolean
}

export interface ITslpSeriesState extends ITslpSeriesProps {

}

export interface ITslpSeriesProps {
    title: string,
    color: Color,
    size: number,
    meas: IMeasurement,
    fromVarTime: VarTime,
    toVarTime: VarTime,
    displayTimeShift: ITimePeriod,
    renderStrategy: PlotlyRenderStrategy,
    seriesStyle: TslpSeriesStyle,
    yAxisIndex: number,
    yAxisSide: YAxisSide,
    yAxisOffset: number,
    points: ITslpDataPoint[]
}

export class TslpSeriesProps implements ITslpSeriesProps {
    seriesStyle: TslpSeriesStyle = TslpSeriesStyle.line;
    renderStrategy = PlotlyRenderStrategy.scatter;
    title: string = "Series Name";
    color: Color = "blue";
    size: number = 2;
    meas: IMeasurement = new ScadaMeasurement()
    fromVarTime: VarTime = new VarTime();
    toVarTime: VarTime = new VarTime();
    displayTimeShift: ITimePeriod = new DisplayTimeShift();
    yAxisIndex: number = 1;
    yAxisSide: YAxisSide = YAxisSide.left;
    yAxisOffset: number = 0;
    points: ITslpDataPoint[] = []
}

export interface ITslpDataPoint {
    timestamp: number,
    value: number,
    quality?: TslpDataPointQuality
}

export enum TslpDataPointQuality {
    Good = 1,
    Bad,
    Suspect,
    Replaced,
}

export enum PlotlyRenderStrategy {
    scatter = "scatter",
    scattergl = "scattergl"
}

export enum TslpSeriesStyle {
    line = "line",
    duration = "duration",
    boxplot = "boxplot",
}

export interface ITimePeriod {
    years: number,
    months: number,
    days: number,
    hrs: number,
    mins: number,
    secs: number,
    millis: number
}

export class TimePeriod implements ITimePeriod {
    years: number = 0;
    months: number = 0;
    days: number = 0;
    hrs: number = 0;
    mins: number = 0;
    secs: number = 0;
    millis: number = 0;
    static getSeconds(per: ITimePeriod): number {
        return per.years * 365 * 30 * 24 * 60 * 60 + per.months * 30 * 24 * 60 * 60 + per.days * 24 * 60 * 60 + per.hrs * 60 * 60 + per.mins * 60 + per.secs + per.millis * 0.001;
    }
}

export class DisplayTimeShift implements ITimePeriod {
    years = 0;
    months = 0;
    days = 0;
    hrs = 0;
    mins = 0;
    secs = 0;
    millis = 0;
}

export interface IFrame {
    name: string;
    data: [{ x: Datum, y: Datum }];
    group: 'lower' | 'upper';
}

export interface IFigure {
    data: Data[];
    layout: Partial<Layout>;
}

export enum YAxisSide {
    left = "left",
    right = "right"
}
import { Color, Datum, Data, Layout } from "plotly.js";
import { IMeasurement } from "../measurements/IMeasurement";
import { VarTime } from './../variable_time/VariableTime';
import { IDashWidgetContentState, IDashWidgetContentProps } from "./IDashWidgetContent";

export interface TslpProps extends IDashWidgetContentProps {
    series: TslpSeriesState[],
    backgroundColor?: Color,
    title:string
}

export interface TslpState extends IDashWidgetContentState {
    series: TslpSeriesState[],
    backgroundColor?: Color,
    title:string,
    mounted: boolean
}

export interface TslpSeriesState {
    points: TslpDataPoint[],
    color: Color,
    meas: IMeasurement,
    fromVarTime: VarTime,
    toVarTime: VarTime,
    displayTimeShift: DisplayTimeShift
}

export interface TslpDataPoint {
    timestamp: Date,
    value: number,
    quality?: TslpDataPointQuality
}

export enum TslpDataPointQuality {
    Good = 1,
    Bad,
    Suspect,
    Replaced,
}

export interface DisplayTimeShift {
    years: number,
    months: number,
    days: number,
    hrs: number,
    mins: number,
    secs: number,
    millis: number
}

export interface Frame {
    name: string;
    data: [{ x: Datum, y: Datum }];
    group: 'lower' | 'upper';
}

export interface Figure {
    data: Data[];
    layout: Partial<Layout>;
}
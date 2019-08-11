import { Color, Datum, Data, Layout } from "plotly.js";
import { IMeasurement } from "../measurements/IMeasurement";
import { VarTime } from './../variable_time/VariableTime';

export interface TslpProps {
    series: TslpSeries[],
    title: string,
    backgroundColor?: Color
}

export interface TslpState {
    series: TslpSeries[],
    title: string,
    backgroundColor?: Color,
    mounted: boolean,
}

export interface TslpSeries {
    points: TslpDataPoint[],
    color: Color,
    meas: IMeasurement,
    fromVarTime: VarTime
    toVarTime: VarTime,
    displayTimeShift: DisplayTimeShift,
    updateData(): boolean
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
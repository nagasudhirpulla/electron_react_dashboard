import { Color, Datum, Data, Layout } from "plotly.js";
import { IMeasurement } from "../measurements/IMeasurement";
import { VarTime } from './../variable_time/VariableTime';
import { IDashWidgetContentState, IDashWidgetContentProps } from "./IDashWidgetContent";

export interface ITslpProps extends IDashWidgetContentProps {
    seriesList: ITslpSeriesProps[],
    backgroundColor?: Color,
    title: string
}

export class TslpProps implements ITslpProps {
    seriesList: ITslpSeriesProps[];
    backgroundColor?: Color;
    title: string
}

export interface ITslpState extends IDashWidgetContentState {
    seriesList: ITslpSeriesState[],
    backgroundColor?: Color,
    title: string,
    mounted: boolean
}

export interface ITslpSeriesState extends ITslpSeriesProps {
    points: ITslpDataPoint[]
}

export interface ITslpSeriesProps {
    color: Color,
    meas: IMeasurement,
    fromVarTime: VarTime,
    toVarTime: VarTime,
    displayTimeShift: IDisplayTimeShift
}

export interface ITslpDataPoint {
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

export interface IDisplayTimeShift {
    years: number,
    months: number,
    days: number,
    hrs: number,
    mins: number,
    secs: number,
    millis: number
}

export class DisplayTimeShift implements IDisplayTimeShift {
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
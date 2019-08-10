import { Color, Datum, Data, Layout } from "plotly.js";

export interface TslpProps {
    series: TslpSeries[],
    title: string
}

export interface TslpState {
    series: TslpSeries[],
    title: string,
    mounted: boolean,
}

export interface TslpSeries {
    points: TslpDataPoint[],
    color: Color
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

export interface Frame {
    name: string;
    data: [{ x: Datum, y: Datum }];
    group: 'lower' | 'upper';
}

export interface Figure {
    data: Data[];
    layout: Partial<Layout>;
}
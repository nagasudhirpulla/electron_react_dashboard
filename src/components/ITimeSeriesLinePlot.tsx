import { Color } from "plotly.js";

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
    quality: TslpDataPointQuality
}

export enum TslpDataPointQuality {
    Good = 1,
    Bad,
    Suspect,
    Replaced,
}
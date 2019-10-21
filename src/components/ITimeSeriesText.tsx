import { Color } from "plotly.js";
import { IMeasurement } from "../measurements/IMeasurement";
import { VarTime } from './../variable_time/VariableTime';
import { IDashWidgetContentState, IDashWidgetContentProps } from "./IDashWidgetContent";
import { FontStyleProperty, FontWeightProperty, FontFamilyProperty } from "csstype";
import { DummyMeasurement } from "../measurements/DummyMeasurement";
import { CSSProperties } from 'react';

interface baseProps {
    meas: IMeasurement,
    fromVarTime: VarTime,
    toVarTime: VarTime,
    textComputationStrategy: TextComputationStrategy,
    percentile: number,
    prefixText: string,
    suffixText: string,
    fontColor: Color,
    backgroundColor: Color,
    fontStyle: FontStyleProperty,
    fontWeight: CSSProperties["fontWeight"],
    fontFamily: FontFamilyProperty,
    fontSize: number,
    val: number,
    decimalPrecision: number
}

export interface ITsTextProps extends IDashWidgetContentProps, baseProps {

}

export interface ITsTextState extends baseProps, IDashWidgetContentState {
    mounted: boolean
}

export class TsTextProps implements ITsTextProps {
    static typename: string = 'TsTextProps';
    discriminator: string = TsTextProps.typename;
    border: string = "1px solid lightgray";
    meas: IMeasurement = new DummyMeasurement();
    fromVarTime: VarTime = new VarTime();
    toVarTime: VarTime = new VarTime();
    textComputationStrategy: TextComputationStrategy = TextComputationStrategy.firstSample;
    percentile: number = 50;
    prefixText: string = "";
    suffixText: string = "";
    fontColor: Color = "black";
    backgroundColor: Color = "transparent";
    fontStyle: FontStyleProperty = "normal";
    fontWeight: CSSProperties["fontWeight"] = "normal";
    fontFamily: FontFamilyProperty = "sans-serif";
    fontSize: number = 1;
    val: number = 0;
    decimalPrecision: number = 2;
}

export enum TextComputationStrategy {
    firstSample = "firstSample",
    lastSample = "lastSample",
    average = "average",
    max = "max",
    min = "min",
    percentile = "percentile",
    sum = "sum",
    noData = "noData"
}
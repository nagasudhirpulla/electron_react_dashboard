import { Color } from "plotly.js";
import { IMeasurement } from "../measurements/IMeasurement";
import { VarTime } from './../variable_time/VariableTime';
import { IDashWidgetContentState, IDashWidgetContentProps } from "./IDashWidgetContent";
import { FontStyleProperty, FontWeightProperty, FontFamilyProperty } from "csstype";
import { DummyMeasurement } from "../measurements/DummyMeasurement";

interface baseProps {
    meas: IMeasurement,
    fromVarTime: VarTime,
    toVarTime: VarTime,
    textComputationStrategy: TextComputationStrategy,
    prefixText: string,
    suffixText: string,
    fontcolor: Color,
    backgroundColor: Color,
    fontStyle: FontStyleProperty,
    fontWeight: FontWeightProperty,
    fontFamily: FontFamilyProperty,
    fontSize: number,
    val: number
}

export interface ITsTextProps extends IDashWidgetContentProps, baseProps {

}

export interface ITsTextState extends baseProps, IDashWidgetContentState {
    mounted: boolean
}

export class TsTextProps implements ITsTextProps {
    val: number = 0;
    static typename: string = 'TsTextProps';
    discriminator: string = TsTextProps.typename;
    border: string = "1px solid lightgray";
    meas: IMeasurement = new DummyMeasurement();
    fromVarTime: VarTime = new VarTime();
    toVarTime: VarTime = new VarTime();
    textComputationStrategy: TextComputationStrategy = TextComputationStrategy.firstSample;
    prefixText: string = "";
    suffixText: string = "";
    fontcolor: Color = "black";
    backgroundColor: Color = "transparent";
    fontStyle: FontStyleProperty = "normal";
    fontWeight: FontWeightProperty = "normal";
    fontFamily: FontFamilyProperty = "sans-serif";
    fontSize: number = 1;
}

export enum TextComputationStrategy {
    firstSample = "firstSample",
    lastSample = "lastSample",
    average = "average",
    max = "max",
    min = "min",
    percentile = "percentile"
}
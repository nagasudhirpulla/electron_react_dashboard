/**
 * Timeseries line plot component that takes in timeseries data
 */
import React, { Component, CSSProperties } from 'react';
import './TimeSeriesLinePlot.css';
import { ITsTextProps, ITsTextState, TsTextProps, TextComputationStrategy } from "./ITimeSeriesText";
import { IDashWidgetContent } from './IDashWidgetContent';
import { DummyMeasurement } from '../measurements/DummyMeasurement';
import { VarTime } from '../variable_time/VariableTime';

class TimeSeriesText extends Component<ITsTextProps, ITsTextState> implements IDashWidgetContent {
    static defaultProps: ITsTextProps = {
        discriminator: TsTextProps.typename,
        border: "1px solid lightgray",
        meas: new DummyMeasurement(),
        fromVarTime: new VarTime(),
        toVarTime: new VarTime(),
        textComputationStrategy: TextComputationStrategy.firstSample,
        prefixText: "",
        suffixText: "",
        fontColor: "black",
        backgroundColor: "transparent",
        fontStyle: "normal",
        fontWeight: "normal",
        fontFamily: "sans-serif",
        fontSize: 1,
        val: 0,
        decimalPrecision: 2
    };

    state = {
        border: this.props.border,
        meas: this.props.meas,
        fromVarTime: this.props.fromVarTime,
        toVarTime: this.props.toVarTime,
        textComputationStrategy: this.props.textComputationStrategy,
        prefixText: this.props.prefixText,
        suffixText: this.props.suffixText,
        fontColor: this.props.fontColor,
        backgroundColor: this.props.backgroundColor,
        fontStyle: this.props.fontStyle,
        fontWeight: this.props.fontWeight,
        fontFamily: this.props.fontFamily,
        fontSize: this.props.fontSize,
        mounted: false,
        val: this.props.val,
        decimalPrecision: this.props.decimalPrecision
    };

    componentDidMount() {
        this.setState({ mounted: true } as ITsTextState);
    }

    async fetchAndSetPntData(): Promise<boolean> {
        return true;
    }

    render() {
        const textStyle: CSSProperties = {
            color: this.state.fontColor,
            backgroundColor: this.state.backgroundColor,
            fontStyle: this.state.fontStyle,
            fontWeight: this.state.fontWeight,
            fontFamily: this.state.fontFamily,
            fontSize: this.state.fontSize + "em"
        };
        const decimalDivider = Math.pow(10, this.state.decimalPrecision);
        const value = Math.round(this.state.val * decimalDivider) / decimalDivider;
        return (
            <span style={textStyle}>{this.state.prefixText}{value}{this.state.suffixText}</span>
        );
    }
}

export default TimeSeriesText;
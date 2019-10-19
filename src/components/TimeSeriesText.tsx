/**
 * Timeseries line plot component that takes in timeseries data
 */
import React, { Component } from 'react';
import './TimeSeriesLinePlot.css';
import { ITsTextProps, ITsTextState, TsTextProps, TextComputationStrategy } from "./ITimeSeriesText";
import Plot from 'react-plotly.js';
import { Data, Datum, Config, Layout } from 'plotly.js';
import { Color } from 'plotly.js';
import { IDashWidgetContent } from './IDashWidgetContent';
import { IFrame } from './ITimeSeriesLinePlot';
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
        fontcolor: "black",
        backgroundColor: "transparent",
        fontStyle: "normal",
        fontWeight: "normal",
        fontFamily: "sans-serif",
        fontSize: 1,
        val: 0
    };

    state = {
        border: this.props.border,
        meas: this.props.meas,
        fromVarTime: this.props.fromVarTime,
        toVarTime: this.props.toVarTime,
        textComputationStrategy: this.props.textComputationStrategy,
        prefixText: this.props.prefixText,
        suffixText: this.props.suffixText,
        fontcolor: this.props.fontcolor,
        backgroundColor: this.props.backgroundColor,
        fontStyle: this.props.fontStyle,
        fontWeight: this.props.fontWeight,
        fontFamily: this.props.fontFamily,
        fontSize: this.props.fontSize,
        mounted: false,
        val: this.props.val
    };

    componentDidMount() {
        this.setState({ mounted: true } as ITsTextState);
    }

    async fetchAndSetPntData(): Promise<boolean> {
        return true;
    }

    render() {
        return (
            <></>
        );
    }
}

export default TimeSeriesText;
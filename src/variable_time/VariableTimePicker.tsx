/**
 * VariableTimePicker component
 */
import React, { Component } from 'react';
import './TimeSeriesLinePlot.css';
import Plot from 'react-plotly.js';
import { Data, Datum, Config, Layout } from 'plotly.js';
import { Color } from 'plotly.js';
import { ITslpProps, ITslpState } from '../components/ITimeSeriesLinePlot';
class VariableTimePicker extends Component<ITslpProps, ITslpState> {
    static defaultProps: ITslpProps = {
        seriesList: [],
        title: 'Default Title',
    };

    state = {
        seriesList: this.props.seriesList,
        mounted: false,
        title: this.props.title,
    };

    componentDidMount() {
        this.setState({ mounted: true } as ITslpState);
    }

    // type definitions at https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-plotly.js/index.d.ts
    render() {
        let x = 1;

        return (
            <div></div>
        );
    }
}

export default VariableTimePicker;
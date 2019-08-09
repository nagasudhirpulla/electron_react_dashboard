/**
 * Timeseries line plot component that takes in timeseries data
 */
import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import './TimeSeriesLinePlot.css';
import { TslpProps, TslpState, TslpSeries, TslpDataPoint, TslpDataPointQuality } from "./ITimeSeriesLinePlot";

class TimeSeriesLinePlot extends Component<TslpProps, TslpState> {
    static defaultProps: TslpProps = {
        series: [],
        title: 'Default Title'
    };

    state = {
        series: this.props.series,
        mounted: false,
        title: this.props.title
    };

    componentDidMount() {
        this.setState({ mounted: true } as TslpState);
    }

    generateSeriesPnts() {
        let series_data_template = { x: [], y: [], type: 'scatter', mode: 'lines+markers', marker: { color: 'red' } }
        
        return ;
    }

    render() {
        let plot_data = []
        let plot_layout = { title: this.state.title }
        let plot_frames = []
        let plot_config = {}

        return (
            <Plot
                data={plot_data}
                layout={plot_layout}
                frames={plot_frames}
                config={plot_config}
            />
        );
    }
}

export default TimeSeriesLinePlot;
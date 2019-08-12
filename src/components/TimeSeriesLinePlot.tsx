/**
 * Timeseries line plot component that takes in timeseries data
 */
import React, { Component } from 'react';
import './TimeSeriesLinePlot.css';
import { TslpProps, TslpState, TslpSeriesState, TslpDataPoint, TslpDataPointQuality, Frame } from "./ITimeSeriesLinePlot";
import Plot from 'react-plotly.js';
import { Data, Datum, Config, Layout } from 'plotly.js';
import { Color } from 'plotly.js';
import { IDashWidgetContent } from './IDashWidgetContent';

class TimeSeriesLinePlot extends Component<TslpProps, TslpState> implements IDashWidgetContent {
    static defaultProps: TslpProps = {
        series: [],
        title: 'Default Title',
    };

    state = {
        series: this.props.series.map((s, sInd) => { return { ...s, points: [] } }),
        mounted: false,
        title: this.props.title,
    };

    componentDidMount() {
        this.setState({ mounted: true } as TslpState);
    }

    generateSeriesData(seriesIter: number): Data {
        let series_data_template: Data = { x: [], y: [], type: 'scatter', mode: 'lines+markers', marker: { color: 'red' as Color } }
        let seriesData: Data = { ...series_data_template };
        seriesData.marker.color = this.state.series[seriesIter].color;
        for (let pntIter = 0; pntIter < this.state.series[seriesIter].points.length; pntIter++) {
            const dataPnt = this.state.series[seriesIter].points[pntIter];
            (seriesData.x as Datum[]).push(dataPnt.timestamp);
            (seriesData.y as Datum[]).push(dataPnt.value);
        }
        return seriesData;
    }

    generatePlotData() {
        let plot_data = []
        for (let seriesIter = 0; seriesIter < this.state.series.length; seriesIter++) {
            plot_data.push(this.generateSeriesData(seriesIter));
        }
        return plot_data;
    }

    refresh(): boolean {
        this.generatePlotData();
        return true;
    }

    // type definitions at https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-plotly.js/index.d.ts
    render() {
        let plot_data: Data[] = this.generatePlotData()
        let plot_layout: Partial<Layout> = { title: this.state.title }
        let plot_frames: Frame[] = []
        let plot_config: Partial<Config> = {}

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
/**
 * Timeseries line plot component that takes in timeseries data
 */
import React, { Component } from 'react';
import './TimeSeriesLinePlot.css';
import { ITslpProps, ITslpState, ITslpDataPoint, IFrame, TslpProps, TimePeriod, TslpSeriesStyle, YAxisSide } from "./ITimeSeriesLinePlot";
import Plot from 'react-plotly.js';
import { Data, Datum, Config, Layout } from 'plotly.js';
import { Color } from 'plotly.js';
import { IDashWidgetContent } from './IDashWidgetContent';

class TimeSeriesLinePlot extends Component<ITslpProps, ITslpState> implements IDashWidgetContent {
    static defaultProps: ITslpProps = {
        discriminator: TslpProps.typename,
        border: '1px solid lightgray',
        backgroundColor: 'white',
        titleColor: 'black',
        seriesList: [],
        title: 'Default Title',
        showGrid: true
    };

    state = {
        backgroundColor: this.props.backgroundColor,
        seriesList: this.props.seriesList,
        titleColor: this.props.titleColor,
        mounted: false,
        title: this.props.title,
        showGrid: this.props.showGrid
    };

    componentDidMount() {
        this.setState({ mounted: true } as ITslpState);
    }

    generateSeriesData(seriesIter: number): Data {
        let series_data_template: Data = { name: this.state.seriesList[seriesIter].title, x: [], y: [], type: this.state.seriesList[seriesIter].renderStrategy, mode: 'lines', line: { color: 'red' as Color, width: 2 } }
        const seriesStyle = this.state.seriesList[seriesIter].seriesStyle;
        let seriesData: Data = { ...series_data_template };

        // use different series template for boxplot
        if (seriesStyle == TslpSeriesStyle.boxplot) {
            seriesData = {
                name: this.state.seriesList[seriesIter].title,
                y: [],
                type: 'box',
                marker: {
                    color: this.state.seriesList[seriesIter].color
                }
            };
        } else {
            // set line color and width
            seriesData.line.color = this.state.seriesList[seriesIter].color;
            seriesData.line.width = this.state.seriesList[seriesIter].size;
        }

        // implement y axis settings
        let yAxisInd = this.state.seriesList[seriesIter].yAxisIndex;
        if (yAxisInd > 0) {
            seriesData['yaxis'] = `y${yAxisInd}`;
        }

        // determine series data display time shift
        let shiftMillis: number = 0;
        if (seriesStyle != TslpSeriesStyle.duration) {
            shiftMillis = 1000 * TimePeriod.getSeconds(this.state.seriesList[seriesIter].displayTimeShift);
        }

        // get points from measurement
        for (let pntIter = 0; pntIter < this.state.seriesList[seriesIter].points.length; pntIter++) {
            const dataPnt = this.state.seriesList[seriesIter].points[pntIter];
            let xVal: Datum = dataPnt.timestamp;
            if (seriesStyle == TslpSeriesStyle.line) {
                xVal = new Date(dataPnt.timestamp + shiftMillis);
            }
            if (seriesStyle != TslpSeriesStyle.boxplot) {
                (seriesData.x as Datum[]).push(xVal);
            }
            (seriesData.y as Datum[]).push(dataPnt.value);
        }
        return seriesData;
    }

    generatePlotData() {
        let plot_data = []
        for (let seriesIter = 0; seriesIter < this.state.seriesList.length; seriesIter++) {
            plot_data.push(this.generateSeriesData(seriesIter));
        }
        return plot_data;
    }

    async fetchAndSetPntData(): Promise<boolean> {
        // fetch the timeseries data
        for (let seriesIter = 0; seriesIter < this.state.seriesList.length; seriesIter++) {
            const series = this.state.seriesList[seriesIter];
            const pnts: ITslpDataPoint[] = [];
            this.state.seriesList[seriesIter].points = pnts;
        }
        return true;
    }

    // type definitions at https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-plotly.js/index.d.ts
    render() {
        // this.fetchAndSetPntData();
        let plot_data: Data[] = this.generatePlotData();
        let y_axis_common_obj = {
            tickfont: {
                color: this.state.titleColor
            },
            showgrid: this.state.showGrid
        };
        let plot_layout: Partial<Layout> = {
            autosize: true,
            paper_bgcolor: this.state.backgroundColor,
            plot_bgcolor: this.state.backgroundColor,
            legend: {
                orientation: "h",
                font: {
                    color: this.state.titleColor
                }
            },
            title: {
                text: this.state.title,
                font: {
                    color: this.state.titleColor
                }
            },
            xaxis: {
                tickfont: {
                    color: this.state.titleColor
                },
                showgrid: this.state.showGrid
            },
            yaxis: {
                ...y_axis_common_obj
            }
        };

        // iterate through all series objects to create the Y Axis Summary object
        let yAxSummObj: { [key: string]: { side: YAxisSide, offset: number, color: string } } = {};
        for (let serIter = 0; serIter < this.state.seriesList.length; serIter++) {
            let yAxisInd = this.state.seriesList[serIter].yAxisIndex;
            let yAxisSide = this.state.seriesList[serIter].yAxisSide;
            let yAxisOffset = this.state.seriesList[serIter].yAxisOffset;
            let yAxisCol = this.state.seriesList[serIter].color;
            if (yAxisInd > 1) {
                yAxSummObj[yAxisInd] = { side: yAxisSide, offset: yAxisOffset, color: yAxisCol };
            }
        }
        const yAxisIndices = Object.keys(yAxSummObj);
        // create additional yAxis objects
        for (let yInd = 0; yInd < yAxisIndices.length; yInd++) {
            let yAxObj = {
                ...y_axis_common_obj,
                overlaying: 'y',
                anchor: 'x',
                titlefont: { color: yAxSummObj[yAxisIndices[yInd]].color },
                tickfont: { color: yAxSummObj[yAxisIndices[yInd]].color },
            };
            if (yAxSummObj[yAxisIndices[yInd]].side == YAxisSide.right) {
                yAxObj['side'] = 'right';
            }
            if (yAxSummObj[yAxisIndices[yInd]].offset != 0) {
                yAxObj['anchor'] = 'free';
                yAxObj['position'] = yAxSummObj[yAxisIndices[yInd]].offset;
            }
            plot_layout[`yaxis${yAxisIndices[yInd]}`] = yAxObj;
        }

        let plot_frames: IFrame[] = [];
        let plot_config: Partial<Config> = {};

        return (
            <Plot
                data={plot_data}
                layout={plot_layout}
                frames={plot_frames}
                config={plot_config}
                style={{ width: '100%', height: '100%' }}
            />
        );
    }
}

export default TimeSeriesLinePlot;
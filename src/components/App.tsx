import React, { Component } from 'react';
import './App.css';
import './rgl_styles.css';
// import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import { AppProps, AppState, LayoutItem, Layout } from "./IApp";
import { v4 as uuid } from 'uuid';
import { IDashWidgetProps } from './dash_widget/IDashWidgetState';
// import { IDashWidgetContentProps } from './IDashWidgetContent';
import { ITslpSeriesProps, DisplayTimeShift, TslpProps, ITslpProps, ITslpDataPoint } from './ITimeSeriesLinePlot';
// import { DummyMeasurement } from './../measurements/DummyMeasurement';
import { VarTime } from './../variable_time/VariableTime';
import TimeSeriesLinePlot from './TimeSeriesLinePlot';
import { ScadaMeasurement, IScadaMeasurement } from '../measurements/ScadaMeasurement';
const showOpenDialog = require('electron').remote.dialog.showOpenDialog;
const showSaveDialog = require('electron').remote.dialog.showSaveDialog;
import { readFile, writeFile } from 'fs';
import { IMeasurement } from '../measurements/IMeasurement';
import { ScadaTslpFetcher } from '../Fetchers/ScadaTslpFetcher';
// make promise version of fs.readFile()
const readFileAsync = function (filename: string) {
  return new Promise(function (resolve, reject) {
    readFile(filename, function (err, data) {
      if (err)
        reject(err);
      else
        resolve(data);
    });
  });
};

const writeFileAsync = function (filename: string, contents: string) {
  return new Promise(function (resolve, reject) {
    writeFile(filename, contents, function (err) {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
};


const ResponsiveReactGridLayout = WidthProvider(Responsive);

class App extends React.Component<AppProps, AppState> {
  static defaultProps = {
    className: "layout",
    rowHeight: 150,
    onLayoutChange: function (currLayout: Layout, allLayouts) { },
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    initialLayout: { lg: [] },
    appSettings: { scadaServerBase: "localhost" },
    widgetProps: generateWidgetProps()
  };

  state = {
    currentBreakpoint: "lg",
    compactType: "vertical",
    mounted: false,
    widgetProps: this.props.widgetProps,
    appSettings: this.props.appSettings
  };

  componentDidMount() {
    this.setState({ mounted: true } as AppState);
  }

  onBreakpointChange = (breakpoint: string) => {
    this.setState({ currentBreakpoint: breakpoint } as AppState);
  };

  onCompactTypeChange = () => {
    const { compactType: oldCompactType } = this.state;
    const compactType =
      oldCompactType === "horizontal"
        ? "vertical"
        : oldCompactType === "vertical" ? null : "horizontal";
    this.setState({ compactType } as AppState);
  };

  onLayoutChange = (layout: Layout, layts) => {
    this.props.onLayoutChange(layout, layts);
    let layouts = layts[this.state.currentBreakpoint];
    let widgetProps = this.state.widgetProps;
    for (let layInd = 0; (layInd < layouts.length) && (layInd < this.state.widgetProps.length); layInd++) {
      this.state.widgetProps[layInd].layout = layouts[layInd];
    }
    this.setState({ widgetProps: widgetProps } as AppState);
  };

  onNewLayout = () => {
    this.setState({ widgetProps: generateWidgetProps() } as AppState);
  };

  onAddItem = () => {
    this.setState({
      widgetProps: [...this.state.widgetProps, {
        layout: {
          x: 0,
          y: Infinity,
          w: 5,
          h: 1,
          i: uuid(),
          static: false
        },
        contentProps: {}
      }]
    } as AppState);
  };

  onOpenDashboard = async () => {
    const dialogRes = await showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'JSON', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      title: 'Open Dashboard File'
    }) as any;
    const openFilename: string = dialogRes.filePaths[0] as string;
    console.log(`Opening file ${openFilename}`);
    const fileContents: string = await readFileAsync(openFilename) as string;
    console.log(`${fileContents}`);
    const stateObj = JSON.parse(fileContents) as AppState;
    console.log(stateObj);
    this.setState({ widgetProps: [] } as AppState);
    this.setState(stateObj);
  };

  onSaveDashboard = async () => {
    const dialogRes = await showSaveDialog({
      filters: [
        { name: 'JSON', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      title: 'Save Dashboard File'
    }) as any;
    if (!(dialogRes.cancelled == true)) {
      const saveFilename: string = dialogRes.filePath;
      console.log(`Saving state to ${saveFilename}`);
      const fileContents = JSON.stringify(this.state, null, 2);
      const isSaved = await writeFileAsync(saveFilename, fileContents);
      console.log(`Save status = ${isSaved}`);
    }
  };

  onRemoveItem = (ind: number) => {
    this.setState({
      widgetProps: [
        ...this.state.widgetProps.slice(0, ind),
        ...this.state.widgetProps.slice(ind + 1)]
    } as AppState);
  }

  onRefreshItem = async (ind: number) => {
    let fetcher: ScadaTslpFetcher = new ScadaTslpFetcher();
    fetcher.serverBaseAddress = this.state.appSettings.scadaServerBase;

    let wp = this.state.widgetProps[ind];

    if (wp.contentProps.discriminator == TslpProps.typename) {
      const tslpProps: ITslpProps = wp.contentProps as ITslpProps;
      for (let seriesIter = 0; seriesIter < tslpProps.seriesList.length; seriesIter++) {
        let series = tslpProps.seriesList[seriesIter];
        let pnts: ITslpDataPoint[] = []

        if (series.meas.discriminator == ScadaMeasurement.typename) {
          series.meas = series.meas as IScadaMeasurement;
          pnts = await fetcher.fetchData(series.fromVarTime, series.toVarTime, series.meas as IScadaMeasurement);
        }

        // fetch the timeseries data
        (wp.contentProps as TslpProps).seriesList[seriesIter].points = pnts;
      }
    }

    const newState = {
      ...this.state,
      widgetProps: [
        ...this.state.widgetProps.slice(0, ind),
        { ...wp },
        ...this.state.widgetProps.slice(ind + 1),
      ]
    }
    this.setState({ ...newState } as AppState);
  }

  deriveLayoutItems = (): Layout => {
    let layouts: Layout = [];
    this.state.widgetProps.map((ws, wsIndex) => {
      layouts[wsIndex] = { ...ws.layout };
    });
    return layouts;
  };

  generateDOM = () => {
    return this.state.widgetProps.map((ws: IDashWidgetProps, i) => {
      let l: LayoutItem = ws.layout;
      let content = <div className="cellContent"></div>;
      if (ws.contentProps.discriminator == TslpProps.typename) {
        content = <div className="cellContent" key={l.i + '_timeseries'}>
          <TimeSeriesLinePlot {...ws.contentProps}></TimeSeriesLinePlot>
        </div>;
      }
      return (
        <div key={l.i} className={l.static ? "static" : ""}>
          <div className="dragHandle">
            <div style={{ textAlign: 'center' }}>{l.i}</div>
            <span
              className="refreshBtn"
              onClick={this.onRefreshItem.bind(this, i)}
            >()</span>
            <span
              className="removeBtn"
              onClick={this.onRemoveItem.bind(this, i)}
            >x</span>
          </div>
          {content}
        </div>
      );
    });
  };

  render() {
    let layoutsDict = {};
    layoutsDict[this.state.currentBreakpoint] = this.deriveLayoutItems();
    return (
      <div>
        <div>
          Current Breakpoint: {this.state.currentBreakpoint} ({
            this.props.cols[this.state.currentBreakpoint]
          }{" "}
          columns)
        </div>
        <div>
          Compaction type:{" "}
          {this.state.compactType || "No Compaction"}
        </div>
        <button onClick={this.onNewLayout}>Generate New Layout</button>
        <button onClick={this.onCompactTypeChange}>
          Change Compaction Type
        </button>
        <button onClick={this.onAddItem}>Add Widget</button>
        <button onClick={this.onSaveDashboard}>Save Dashboard</button>
        <button onClick={this.onOpenDashboard}>Open Dashboard</button>
        <ResponsiveReactGridLayout
          {...this.props}
          layouts={layoutsDict}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          // WidthProvider option
          measureBeforeMount={false}
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          useCSSTransforms={this.state.mounted}
          compactType={this.state.compactType}
          preventCollision={!this.state.compactType}
          draggableHandle='.dragHandle'
        >
          {this.generateDOM()}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

export default App;

function generateWidgetProps(): IDashWidgetProps[] {
  return [0, 1, 2, 3].map(function (i, ind) {
    let title: string = uuid();
    let fromVarTime = new VarTime();
    fromVarTime.absoluteTime = (new Date().getTime()) - 2 * 60 * 60 * 1000;

    let seriesProps: ITslpSeriesProps = {
      color: "blue",
      meas: new ScadaMeasurement(),
      fromVarTime: fromVarTime,
      toVarTime: new VarTime(),
      displayTimeShift: new DisplayTimeShift(),
      points: []
    }
    let contentProps: TslpProps = new TslpProps();
    contentProps.seriesList = [seriesProps];
    contentProps.title = `Plot ${ind + 1}`;

    let widgetProps = {
      layout: {
        x: (ind * 2) % 12,
        y: Math.floor(ind / 6),
        w: 5,
        h: 2,
        i: title,
        static: false
      },
      contentProps: contentProps
    };

    return widgetProps;
  });
}
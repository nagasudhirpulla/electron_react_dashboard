import React, { Component } from 'react';
import './App.css';
import './rgl_styles.css';
import './react-datetime.css';
// import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import { AppProps, AppState, LayoutItem, Layout } from "./IApp";
import { v4 as uuid } from 'uuid';
import { IDashWidgetProps, DashWidgetProps } from './dash_widget/IDashWidgetState';
// import { IDashWidgetContentProps } from './IDashWidgetContent';
import { ITslpSeriesProps, DisplayTimeShift, TslpProps, ITslpProps, ITslpDataPoint, TslpSeriesProps } from './ITimeSeriesLinePlot';
// import { DummyMeasurement } from './../measurements/DummyMeasurement';
import { VarTime } from './../variable_time/VariableTime';
import TimeSeriesLinePlot from './TimeSeriesLinePlot';
import { ScadaMeasurement, IScadaMeasurement } from '../measurements/ScadaMeasurement';
const showOpenDialog = require('electron').remote.dialog.showOpenDialog;
const showSaveDialog = require('electron').remote.dialog.showSaveDialog;
import { readFile, writeFile } from 'fs';
// import { IMeasurement } from '../measurements/IMeasurement';
import { ScadaTslpFetcher } from '../Fetchers/ScadaTslpFetcher';
import { ILayoutDict } from '../IDictionary';
import Modal from './modals/Modal';
import { WidgetAddForm } from './modals/WidgetAddForm';
import { TslpSeriesAddForm } from './modals/TslpSeriesAddForm';
import { PMUTslpFetcher } from '../Fetchers/PMUTslpFetcher';
import { PMUMeasurement, IPMUMeasurement } from '../measurements/PMUMeasurement';
import { FormikTslpEditForm } from './modals/TslpEditForm';
import { IDashWidgetContentProps } from './IDashWidgetContent';

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
    rowHeight: 100,
    onLayoutChange: function (currLayout: Layout, allLayouts) { },
    breakpoints: { lg: 1200, md: 996, sm: 768 },
    cols: { lg: 12, md: 10, sm: 6 },
    initialLayout: { lg: [] },
    appSettings: { scadaServerBase: "localhost", pmuServerBase: "172.16.184.35" },
    widgetProps: generateWidgetProps()
  };

  state = {
    currentBreakpoint: "lg",
    compactType: "vertical",
    mounted: false,
    widgetProps: this.props.widgetProps,
    appSettings: this.props.appSettings,
    showWidgetAddModal: true
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

  onLayoutChange = (layout: Layout, layts: ILayoutDict) => {
    this.props.onLayoutChange(layout, layts);
    // get the layts breakpoints
    const laytBrPnts = Object.keys(layts);
    const widgetProps = this.state.widgetProps;
    for (let brPntIter = 0; brPntIter < laytBrPnts.length; brPntIter++) {
      const laytBrPnt = laytBrPnts[brPntIter]
      const layout: Layout = layts[laytBrPnt];
      for (let layInd = 0; (layInd < layout.length) && (layInd < this.state.widgetProps.length); layInd++) {
        // we assume that the order is preserved (todo be sure)
        widgetProps[layInd].layouts[laytBrPnt] = layout[layInd]
      }
    }
    this.setState({ widgetProps: widgetProps } as AppState);
  };

  onNewLayout = () => {
    this.setState({ widgetProps: generateWidgetProps() } as AppState);
  };

  addWidget = (widType: string) => {
    const newWidgetProps = new DashWidgetProps();
    const newLayout = { x: 0, y: Infinity, w: 5, h: 3, i: uuid(), static: false };
    newWidgetProps.layouts[this.state.currentBreakpoint] = { ...newLayout };
    if (widType == TslpProps.typename) {
      // create a timeseries widget
      newWidgetProps.contentProps = new TslpProps();
    }
    this.setState({
      widgetProps: [...this.state.widgetProps, newWidgetProps]
    } as AppState);
  }

  AddWidgetModalContent = (
    <>
      <WidgetAddForm {...{ onFormSubmit: this.addWidget }} />
    </>
  );

  editWidget = (contentProps: IDashWidgetContentProps, ind: number) => {
    console.log(JSON.stringify(contentProps));
    const newState = {
      ...this.state,
      widgetProps: [
        ...this.state.widgetProps.slice(0, ind),
        { ...this.state.widgetProps[ind], contentProps: contentProps },
        ...this.state.widgetProps.slice(ind + 1)
      ]
    };
    this.setState({ ...this.state, widgetProps: [] });
    this.setState(newState);
  }

  EditWidgetModalContent = (ind: number) => {
    return (
      <>
        {
          this.state.widgetProps[ind].contentProps.discriminator == TslpProps.typename &&
          <FormikTslpEditForm {...{ ind: ind, tslpProps: this.state.widgetProps[ind].contentProps as ITslpProps, onFormSubmit: this.editWidget.bind(this) }} />
        }
      </>
    );
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
      //todo remove points from timeseries line props
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

  onEditItem = (ind: number) => {

  }

  onRefreshItem = async (ind: number) => {
    let scadaFetcher: ScadaTslpFetcher = new ScadaTslpFetcher();
    scadaFetcher.serverBaseAddress = this.state.appSettings.scadaServerBase;
    let pmuFetcher: PMUTslpFetcher = new PMUTslpFetcher();
    pmuFetcher.serverBaseAddress = this.state.appSettings.pmuServerBase;

    let wp = this.state.widgetProps[ind];

    if (wp.contentProps.discriminator == TslpProps.typename) {
      const tslpProps: ITslpProps = wp.contentProps as ITslpProps;
      for (let seriesIter = 0; seriesIter < tslpProps.seriesList.length; seriesIter++) {
        let series = tslpProps.seriesList[seriesIter];
        let pnts: ITslpDataPoint[] = []

        if (series.meas.discriminator == ScadaMeasurement.typename) {
          series.meas = series.meas as IScadaMeasurement;
          pnts = await scadaFetcher.fetchData(series.fromVarTime, series.toVarTime, series.meas as IScadaMeasurement);
        }
        else if (series.meas.discriminator == PMUMeasurement.typename) {
          pnts = await pmuFetcher.fetchData(series.fromVarTime, series.toVarTime, series.meas as IPMUMeasurement);
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

  onRefreshAll = async () => {
    let fetcher: ScadaTslpFetcher = new ScadaTslpFetcher();
    fetcher.serverBaseAddress = this.state.appSettings.scadaServerBase;
    for (let wpInd = 0; wpInd < this.state.widgetProps.length; wpInd++) {
      await this.onRefreshItem(wpInd);
    }
  }

  deriveLayouts = (): ILayoutDict => {
    let layouts: ILayoutDict = {};
    this.state.widgetProps.map((wp, wsIndex) => {
      // get breakpoint key of widget layoutsDict
      const brPntKeys = Object.keys(wp.layouts);
      for (let brPntKeyIter = 0; brPntKeyIter < brPntKeys.length; brPntKeyIter++) {
        const brPntKey = brPntKeys[brPntKeyIter];
        // check if key is present in final layouts
        if (wsIndex == 0) {
          layouts[brPntKey] = [];
        }
        // push the layout item in the layouts dictionary
        layouts[brPntKey].push(wp.layouts[brPntKey]);
      }
    });
    return layouts;
  };

  generateDOM = () => {
    return this.state.widgetProps.map((wp: IDashWidgetProps, ind) => {
      let l: LayoutItem = wp.layouts[this.state.currentBreakpoint];
      let content = <div className="cellContent"></div>;
      if (wp.contentProps.discriminator == TslpProps.typename) {
        content = <div className="cellContent" key={l.i + '_timeseries'}>
          <TimeSeriesLinePlot {...wp.contentProps}></TimeSeriesLinePlot>
        </div>;
      }
      return (
        <div key={l.i} className={l.static ? "static" : ""}>
          <div className="dragHandle">
            <div style={{ textAlign: 'center' }}>{" "}</div>
            <Modal modalProps={{ btnText: "/", btnClass: "editItemBtn" }} modalContent={this.EditWidgetModalContent(ind)} />
            <span
              className="refreshBtn"
              onClick={this.onRefreshItem.bind(this, ind)}
            >()</span>
            <span
              className="removeBtn"
              onClick={this.onRemoveItem.bind(this, ind)}
            >x</span>
          </div>
          {content}
        </div>
      );
    });
  };

  render() {
    const layoutsDict = this.deriveLayouts();
    return (
      <div>

        <button onClick={this.onNewLayout}>Generate New Layout</button>
        <button onClick={this.onCompactTypeChange}>
          Compaction - {this.state.compactType || "No Compaction"}
        </button>
        <button onClick={this.onSaveDashboard}>Save Dashboard</button>
        <button onClick={this.onOpenDashboard}>Open Dashboard</button>
        <button onClick={this.onRefreshAll}>Refresh</button>
        <span>
          Current Breakpoint: {this.state.currentBreakpoint} ({
            this.props.cols[this.state.currentBreakpoint]
          }{" "}
          columns)
        </span>

        <Modal modalProps={{ btnText: "Add Widget", btnClass: "add_widget_btn" }} modalContent={this.AddWidgetModalContent} />
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
    let layKey: string = uuid();
    let fromVarTime = new VarTime();
    fromVarTime.absoluteTime = (new Date().getTime()) - 2 * 60 * 60 * 1000;

    let seriesProps: ITslpSeriesProps = {
      title: `Series ${ind + 1}`,
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

    let widgetProps: IDashWidgetProps = {
      layouts: {
        lg: {
          x: (ind * 2) % 12,
          y: Math.floor(ind / 6),
          w: 5,
          h: 3,
          i: layKey,
          static: false
        }
      },
      contentProps: contentProps
    };

    return widgetProps;
  });
}
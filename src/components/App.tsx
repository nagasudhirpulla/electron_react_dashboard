import React, { Component } from 'react';
import './App.css';
import './rgl_styles.css';
import './react-datetime.css';
import { Responsive, WidthProvider } from "react-grid-layout";
import { AppProps, AppState, LayoutItem, Layout } from "./IApp";
import { v4 as uuid } from 'uuid';
import { IDashWidgetProps, DashWidgetProps } from './dash_widget/IDashWidgetState';
import { ITslpSeriesProps, DisplayTimeShift, TslpProps, ITslpProps, ITslpDataPoint, TslpSeriesProps, PlotlyRenderStrategy, TimePeriod } from './ITimeSeriesLinePlot';
import { VarTime } from './../variable_time/VariableTime';
import TimeSeriesLinePlot from './TimeSeriesLinePlot';
import { ScadaMeasurement, IScadaMeasurement } from '../measurements/ScadaMeasurement';
const showOpenDialog = require('electron').remote.dialog.showOpenDialog;
const showSaveDialog = require('electron').remote.dialog.showSaveDialog;
import { ScadaTslpFetcher } from '../Fetchers/ScadaTslpFetcher';
import { ILayoutDict } from '../IDictionary';
import Modal from './modals/Modal';
import { WidgetAddForm } from './modals/WidgetAddForm';
import { PMUTslpFetcher } from '../Fetchers/PMUTslpFetcher';
import { PMUMeasurement, IPMUMeasurement } from '../measurements/PMUMeasurement';
import { FormikTslpEditForm } from './modals/TslpEditForm';
import { IDashWidgetContentProps } from './IDashWidgetContent';
import { FormikAppSettingsEditForm } from './modals/AppSettingsEditForm';
import { DummyTslpFetcher } from '../Fetchers/DummyTslpFetcher';
import { ITslpDataFetcher } from '../Fetchers/IFetcher';
import { DummyMeasurement, IDummyMeasurement } from '../measurements/DummyMeasurement';
import Excel from 'exceljs';
import { readFileAsync, writeFileAsync, saveExcelAsync } from '../utils/fileUtils';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class App extends React.Component<AppProps, AppState> {
  static defaultProps = {
    className: "layout",
    rowHeight: 100,
    onLayoutChange: function (currLayout: Layout, allLayouts) { },
    breakpoints: { lg: 1200, md: 996, sm: 768 },
    cols: { lg: 12, md: 10, sm: 6 },
    initialLayout: { lg: [] },
    appSettings: {
      scadaServerBase: "localhost",
      pmuServerBase: "172.16.184.35",
      timerOn: false,
      timerPeriodicity: new TimePeriod()
    },
    widgetProps: generateWidgetProps()
  };

  state = {
    currentBreakpoint: "lg",
    compactType: "vertical",
    mounted: false,
    timer: {
      isOn: false,
      start: 0,
      busy: false
    },
    widgetProps: this.props.widgetProps,
    appSettings: this.props.appSettings,
    showWidgetAddModal: true
  };

  timer: NodeJS.Timer;

  startTimer = (duringRender: boolean) => {
    const timerPeriod = 1000 * TimePeriod.getSeconds(this.state.appSettings.timerPeriodicity);
    if (timerPeriod <= 0) {
      return;
    }
    const newTimerState = { ...this.state.timer, isOn: true };
    if (duringRender) {
      this.state.timer = { ...newTimerState };
    } else {
      this.setState({ timer: { ...newTimerState } } as AppState);
    }
    this.timer = setInterval(async () => {
      if (this.state.timer.busy == true) {
        return;
      }
      else {
        this.state.timer.busy = true;
        await this.onRefreshAll();
        //await induceDelayAsync(5000);
        this.state.timer.busy = false;
      }
    }, timerPeriod);
  };

  stopTimer = (duringRender: boolean) => {
    const newTimerState = { ...this.state.timer, isOn: false, busy: false };
    if (duringRender) {
      this.state.timer = { ...newTimerState };
    } else {
      this.setState({ timer: { ...newTimerState } } as AppState);
    }
    clearInterval(this.timer);
  }

  toggleTimerClick = () => {
    this.setState({ appSettings: { ...this.state.appSettings, timerOn: !this.state.appSettings.timerOn } } as AppState);
  }

  componentDidMount() {
    this.setState({ mounted: true } as AppState);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
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

  editAppSettings = (appSettings: AppState["appSettings"]) => {
    console.log(JSON.stringify(appSettings));
    this.setState({ appSettings: appSettings } as AppState);
  }

  AddWidgetModalContent = () => {
    return (
      <>
        <WidgetAddForm {...{ onFormSubmit: this.addWidget }} />
      </>
    );
  };

  AppSettingsModalContent = () => {
    return (
      <>
        <FormikAppSettingsEditForm {...{ appSettings: this.state.appSettings, onFormSubmit: this.editAppSettings }} />
      </>
    );
  };

  editWidget = (contentProps: IDashWidgetContentProps, ind: number) => {
    // console.log(JSON.stringify(contentProps));
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

  onExportItem = async (ind: number) => {
    // export the state data of the widget to a file
    let contentProps = this.state.widgetProps[ind].contentProps;

    if (contentProps.discriminator == TslpProps.typename) {
      let wb = new Excel.Workbook();
      // Add Worksheets to the workbook
      let ws = wb.addWorksheet('Sheet 1');
      // construct a data array for csv export
      for (let seriesIter = 0; seriesIter < (contentProps as TslpProps).seriesList.length; seriesIter++) {
        const seriesTitle = (contentProps as TslpProps).seriesList[seriesIter].title;
        ws.getRow(1).getCell(2 * seriesIter + 1).value = `Time_${seriesTitle}`;
        ws.getRow(1).getCell(2 * seriesIter + 2).value = `${seriesTitle}`;
        for (let pntIter = 0; pntIter < (contentProps as TslpProps).seriesList[seriesIter].points.length; pntIter++) {
          const pnt = (contentProps as TslpProps).seriesList[seriesIter].points[pntIter];
          ws.getRow(pntIter + 2).getCell(2 * seriesIter + 1).value = new Date(pnt.timestamp + 5.5 * 60 * 60 * 1000);
          ws.getRow(pntIter + 2).getCell(2 * seriesIter + 2).value = pnt.value;
        }
      }
      await saveExcelAsync(wb);
    }
  };



  onRefreshItem = async (ind: number) => {
    let scadaFetcher: ScadaTslpFetcher = new ScadaTslpFetcher();
    scadaFetcher.serverBaseAddress = this.state.appSettings.scadaServerBase;
    let pmuFetcher: PMUTslpFetcher = new PMUTslpFetcher();
    pmuFetcher.serverBaseAddress = this.state.appSettings.pmuServerBase;
    let dummyFetcher: ITslpDataFetcher = new DummyTslpFetcher();
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
        else if (series.meas.discriminator == DummyMeasurement.typename) {
          pnts = await dummyFetcher.fetchData(series.fromVarTime, series.toVarTime, series.meas as IDummyMeasurement);
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
  };

  onRefreshAll = async () => {
    let fetcher: ScadaTslpFetcher = new ScadaTslpFetcher();
    fetcher.serverBaseAddress = this.state.appSettings.scadaServerBase;
    for (let wpInd = 0; wpInd < this.state.widgetProps.length; wpInd++) {
      await this.onRefreshItem(wpInd);
    }
  };

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
              className="exportBtn"
              onClick={this.onExportItem.bind(this, ind)}
            >v</span>
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
    // check if we have to stop the timer
    if (this.state.timer.isOn == true && this.state.appSettings.timerOn == false) {
      this.stopTimer(true);
    }

    // check if we have to start the timer
    if (this.state.timer.isOn == false && this.state.appSettings.timerOn == true) {
      this.startTimer(true);
    }

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
        <button onClick={this.toggleTimerClick}>{this.state.timer.isOn ? "Stop AutoFetch" : "Start AutoFetch"}</button>
        <span>
          Current Breakpoint: {this.state.currentBreakpoint} ({
            this.props.cols[this.state.currentBreakpoint]
          }{" "}
          columns)
        </span>

        <Modal modalProps={{ btnText: "Add Widget", btnClass: "add_widget_btn" }} modalContent={this.AddWidgetModalContent} />
        <Modal modalProps={{ btnText: "Settings", btnClass: "add_widget_btn" }} modalContent={this.AppSettingsModalContent()} />

        <ResponsiveReactGridLayout
          {...this.props}
          layouts={layoutsDict}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          // WidthProvider option
          measureBeforeMount={false}
          // Animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
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
  return [0].map(function (i, ind) {
    let layKey: string = uuid();
    let fromVarTime = new VarTime();
    fromVarTime.absoluteTime = (new Date().getTime()) - 2 * 60 * 60 * 1000;

    let seriesProps: ITslpSeriesProps = {
      title: `Series ${ind + 1}`,
      renderStrategy: PlotlyRenderStrategy.scatter,
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
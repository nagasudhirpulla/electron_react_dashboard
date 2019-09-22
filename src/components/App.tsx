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
const showConfirmationDialog = require('electron').remote.dialog.showMessageBox;
import { ScadaTslpFetcher } from '../Fetchers/ScadaTslpFetcher';
import { ILayoutDict } from '../IDictionary';
import Modal from './modals/Modal';
import { WidgetAddForm } from './modals/WidgetAddForm';
import { PMUTslpFetcher } from '../Fetchers/PMUTslpFetcher';
import { PMUSoapTslpFetcher } from '../Fetchers/PMUSoapTslpFetcher';
import { PMUMeasurement, IPMUMeasurement } from '../measurements/PMUMeasurement';
import { FormikTslpEditForm } from './modals/TslpEditForm';
import { IDashWidgetContentProps } from './IDashWidgetContent';
import { FormikAppSettingsEditForm } from './modals/AppSettingsEditForm';
import { DummyTslpFetcher } from '../Fetchers/DummyTslpFetcher';
import { ITslpDataFetcher } from '../Fetchers/IFetcher';
import { DummyMeasurement, IDummyMeasurement } from '../measurements/DummyMeasurement';
import Excel from 'exceljs';
import { readFileAsync, writeFileAsync, saveExcelAsync } from '../utils/fileUtils';
import { WbesTslpFetcher } from './../Fetchers/WbesTslpFetcher';
import { WbesMeasurement, IWbesMeasurement } from './../measurements/WbesMeasurement';
import { initUtilsObj } from '../utils/wbesUtils';
import { ShowMessageBoxOptions } from 'electron';
import { stripDataFromAppState } from '../utils/dashboardUtils';
import { ipcRenderer } from 'electron';
import * as channels from '../channelNames'
import { IPrefs } from '../appSettings';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPen, faSyncAlt, faTimesCircle, faCopy, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TsscProps, ITsscProps, ITsscDataPoint } from './ITimeSeriesScatterPlot';
import TimeSeriesScatterPlot from './TimeSeriesScatterPlot';
import { FormikTsscEditForm } from './modals/TsscEditForm';
library.add(faPen, faSyncAlt, faTimesCircle, faCopy, faDownload);

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
      scadaServerPath: "",
      scadaServerPort: 62448,
      pmuServerBase: "172.16.184.35",
      pmuServerPath: "/api/meas_data",
      pmuServerPort: 50100,
      pmuSoapHost: "",
      pmuSoapPort: -1,
      pmuSoapPath: "",
      pmuSoapUsername: "",
      pmuSoapPassword: "",
      pmuSoapRefMeasId: 2127,
      timerOn: false,
      timerPeriodicity: new TimePeriod(),
      backgroundColor: "white"
    },
    widgetProps: generateWidgetProps()
  };

  state: AppState = {
    currentBreakpoint: "lg",
    compactType: "vertical",
    mounted: false,
    timer: {
      isOn: false,
      start: 0,
      busy: false
    },
    widgetProps: this.props.widgetProps,
    appSettings: this.props.appSettings
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
    this.setState({ appSettings: { ...this.state.appSettings, timerOn: !this.state.appSettings.timerOn } } as unknown as AppState);
  }

  openAssociatedFile = () => {
    ipcRenderer.send(channels.openFileInfo, 'ping');
  }

  onIpcOpenAssociatedFile = async (event, filePath: string) => {
    console.log(`Opened file = ${filePath}`)
    await this.openDashboard(filePath);
  }

  getDashboardConfig = () => {
    ipcRenderer.send(channels.getSettings, 'ping');
  }

  onIpcGetDashboardConfig = (event, prefs: IPrefs) => {
    const newAppSettings = {
      ...this.state.appSettings,
      scadaServerBase: prefs.scada.api.host,
      scadaServerPath: prefs.scada.api.path,
      scadaServerPort: prefs.scada.api.port,
      pmuServerBase: prefs.pmu.api.host,
      pmuServerPort: prefs.pmu.api.port,
      pmuServerPath: prefs.pmu.api.path,
      pmuSoapHost: prefs.pmu.soap.host,
      pmuSoapPort: prefs.pmu.soap.port,
      pmuSoapPath: prefs.pmu.soap.path,
      pmuSoapUsername: prefs.pmu.soap.username,
      pmuSoapPassword: prefs.pmu.soap.password,
      pmuSoapRefMeasId: prefs.pmu.soap.refMeasId
    };
    this.setState({ appSettings: { ...newAppSettings } } as AppState);
  };

  componentDidMount() {
    initUtilsObj();
    // register Ipc listeners
    ipcRenderer.on(channels.getSettingsResp, this.onIpcGetDashboardConfig);
    ipcRenderer.on(channels.openFileInfoResp, this.onIpcOpenAssociatedFile);
    this.setState({ mounted: true } as AppState);
    this.openAssociatedFile();
    this.getDashboardConfig();
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
    const dialogOptions = { type: "info", title: "Confirm Layout Reset", buttons: ['OK', 'Cancel'], message: 'Reset Layout?' };
    showConfirmationDialog(null, dialogOptions as ShowMessageBoxOptions, i => {
      // console.log(i);
      if (i == 0) {
        this.setState({ widgetProps: generateWidgetProps() } as AppState);
      }
    });
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
          <FormikTslpEditForm {...{ ind: ind, tslpProps: this.state.widgetProps[ind].contentProps as ITslpProps, onFormSubmit: this.editWidget }} />
        }
        {
          this.state.widgetProps[ind].contentProps.discriminator == TsscProps.typename &&
          <FormikTsscEditForm {...{ ind: ind, tsscProps: this.state.widgetProps[ind].contentProps as ITsscProps, onFormSubmit: this.editWidget }} />
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
    await this.openDashboard(openFilename);
    // console.log(`Opening file ${openFilename}`);
    // const fileContents: string = await readFileAsync(openFilename) as string;
    // console.log(`${fileContents}`);
    // const stateObj = JSON.parse(fileContents) as AppState;
    // console.log(stateObj);
    // this.setState({ widgetProps: [] } as AppState);
    // this.setState(stateObj);
  };

  openDashboard = async (openFilename: string) => {
    if (openFilename == null) {
      return;
    }
    if (openFilename.endsWith('.js')) {
      console.log(`Not Opening js file ${openFilename}`);
      return;
    }
    console.log(`Opening file ${openFilename}`);
    const fileContents: string = await readFileAsync(openFilename) as string;
    // console.log(`${fileContents}`);
    const stateObj = JSON.parse(fileContents) as AppState;
    console.log(stateObj);
    this.setState({ widgetProps: [] } as AppState);
    this.setState(stateObj);
  }

  onSaveDashboard = async () => {
    const dialogRes = await showSaveDialog({
      filters: [
        { name: 'E-Dash', extensions: ['edash'] },
        { name: 'JSON', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      title: 'Save Dashboard File'
    }) as any;
    if (!(dialogRes.cancelled == true)) {
      const saveFilename: string = dialogRes.filePath;
      console.log(`Saving state to ${saveFilename}`);
      const fileContents = JSON.stringify(stripDataFromAppState(this.state), null, 2);
      const isSaved = await writeFileAsync(saveFilename, fileContents);
      console.log(`Save status = ${isSaved}`);
    }
  };

  onRemoveItem = (ind: number) => {
    const dialogOptions = { type: "info", title: "Confirm Widget Delete", buttons: ['OK', 'Cancel'], message: 'Delete Widget' };
    showConfirmationDialog(null, dialogOptions as ShowMessageBoxOptions, i => {
      if (i == 0) {
        this.setState({
          widgetProps: [
            ...this.state.widgetProps.slice(0, ind),
            ...this.state.widgetProps.slice(ind + 1)]
        } as AppState);
      }
    });
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

  onDuplicateWidget = async (ind: number) => {
    const newWidgetProps = new DashWidgetProps();

    newWidgetProps.layouts[this.state.currentBreakpoint] = {
      ...this.state.widgetProps[ind].layouts[this.state.currentBreakpoint],
      x: 0,
      y: Infinity,
      i: uuid(),
      static: false
    };
    newWidgetProps.contentProps = JSON.parse(JSON.stringify(this.state.widgetProps[ind].contentProps));

    this.setState({
      widgetProps: [...this.state.widgetProps, newWidgetProps]
    } as AppState);
  };

  onRefreshItem = async (ind: number) => {
    let scadaFetcher: ScadaTslpFetcher = new ScadaTslpFetcher();
    scadaFetcher.serverBaseAddress = this.state.appSettings.scadaServerBase;
    scadaFetcher.serverPath = this.state.appSettings.scadaServerPath;
    scadaFetcher.serverPort = this.state.appSettings.scadaServerPort;
    // let pmuFetcher: PMUTslpFetcher = new PMUTslpFetcher();
    // pmuFetcher.serverBaseAddress = this.state.appSettings.pmuServerBase;
    // pmuFetcher.serverPort = this.state.appSettings.pmuServerPort;
    // pmuFetcher.serverPath = this.state.appSettings.pmuServerPath;
    let pmuFetcher: PMUSoapTslpFetcher = new PMUSoapTslpFetcher();
    pmuFetcher.host = this.state.appSettings.pmuSoapHost;
    pmuFetcher.port = this.state.appSettings.pmuSoapPort;
    pmuFetcher.path = this.state.appSettings.pmuSoapPath;
    pmuFetcher.username = this.state.appSettings.pmuSoapUsername;
    pmuFetcher.password = this.state.appSettings.pmuSoapPassword;
    pmuFetcher.refMeasId = this.state.appSettings.pmuSoapRefMeasId;
    let dummyFetcher: ITslpDataFetcher = new DummyTslpFetcher();
    let wbesFetcher: ITslpDataFetcher = new WbesTslpFetcher();
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
        else if (series.meas.discriminator == WbesMeasurement.typename) {
          pnts = await wbesFetcher.fetchData(series.fromVarTime, series.toVarTime, series.meas as IWbesMeasurement);
        }
        // fetch the timeseries data
        (wp.contentProps as TslpProps).seriesList[seriesIter].points = pnts;
      }
    } else if (wp.contentProps.discriminator == TsscProps.typename) {
      const tsscProps: ITsscProps = wp.contentProps as ITsscProps;
      for (let seriesIter = 0; seriesIter < tsscProps.seriesList.length; seriesIter++) {
        let series = tsscProps.seriesList[seriesIter];
        let pntsX: ITslpDataPoint[] = [];
        let pntsY: ITslpDataPoint[] = [];
        let pnts: ITsscDataPoint[] = [];

        // get X points
        if (series.meas1.discriminator == DummyMeasurement.typename) {
          pntsX = await dummyFetcher.fetchData(series.fromVarTime, series.toVarTime, series.meas1 as IDummyMeasurement);
        } else if (series.meas1.discriminator == PMUMeasurement.typename) {
          pntsX = await pmuFetcher.fetchData(series.fromVarTime, series.toVarTime, series.meas1 as IPMUMeasurement);
        }
        else if (series.meas1.discriminator == DummyMeasurement.typename) {
          pntsX = await dummyFetcher.fetchData(series.fromVarTime, series.toVarTime, series.meas1 as IDummyMeasurement);
        }
        else if (series.meas1.discriminator == WbesMeasurement.typename) {
          pntsX = await wbesFetcher.fetchData(series.fromVarTime, series.toVarTime, series.meas1 as IWbesMeasurement);
        }

        // get Y points
        if (series.meas2.discriminator == DummyMeasurement.typename) {
          pntsY = await dummyFetcher.fetchData(series.fromVarTime, series.toVarTime, series.meas2 as IDummyMeasurement);
        } else if (series.meas2.discriminator == PMUMeasurement.typename) {
          pntsY = await pmuFetcher.fetchData(series.fromVarTime, series.toVarTime, series.meas2 as IPMUMeasurement);
        }
        else if (series.meas2.discriminator == DummyMeasurement.typename) {
          pntsY = await dummyFetcher.fetchData(series.fromVarTime, series.toVarTime, series.meas2 as IDummyMeasurement);
        }
        else if (series.meas2.discriminator == WbesMeasurement.typename) {
          pntsY = await wbesFetcher.fetchData(series.fromVarTime, series.toVarTime, series.meas2 as IWbesMeasurement);
        }

        // here we assume that we get the same timestamps for both measurements meas1 and meas2
        // todo do time alignment for pntsX and pntsY
        for (let pntInd = 0; pntInd < Math.min(pntsX.length, pntsY.length); pntInd++) {
          const newPnt: ITsscDataPoint = { timestamp: pntsX[pntInd].timestamp, value1: pntsX[pntInd].value, value2: pntsY[pntInd].value };
          pnts.push(newPnt);
        }
        // fetch the timeseries data
        (wp.contentProps as TsscProps).seriesList[seriesIter].points = pnts;
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
    for (let wpInd = 0; wpInd < this.state.widgetProps.length; wpInd++) {
      await this.onRefreshItem(wpInd);
    }
  };

  onOpenPrefsEditor = () => {
    ipcRenderer.send(channels.openPrefsEditor, 'ping');
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
      } else if (wp.contentProps.discriminator == TsscProps.typename) {
        content = <div className="cellContent" key={l.i + '_timeseries'}>
          <TimeSeriesScatterPlot {...wp.contentProps}></TimeSeriesScatterPlot>
        </div>;
      }
      return (
        <div key={l.i} className={l.static ? "static" : ""}>
          <div className="dragHandle">
            <div style={{ textAlign: 'center' }}>{" "}</div>
            <Modal modalProps={{ btnText: <FontAwesomeIcon icon="pen" color='black' size='xs' />, btnClass: "editItemBtn" }} modalContent={this.EditWidgetModalContent(ind)} />
            <span
              className="copyWidBtn"
              onClick={this.onDuplicateWidget.bind(this, ind)}
            ><FontAwesomeIcon icon="copy" color='white' size='xs' /></span>
            <span
              className="exportBtn"
              onClick={this.onExportItem.bind(this, ind)}
            ><FontAwesomeIcon icon="download" color='#4CAF50' size='xs' /></span>
            <span
              className="refreshBtn"
              onClick={this.onRefreshItem.bind(this, ind)}
            ><FontAwesomeIcon icon="sync-alt" color='gold' size='xs' /></span>
            <span
              className="removeBtn"
              onClick={this.onRemoveItem.bind(this, ind)}
            ><FontAwesomeIcon icon="times-circle" color='red' size='xs' /></span>
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
    const divStyle = {
      backgroundColor: this.state.appSettings.backgroundColor
    };

    return (
      <div style={{ backgroundColor: this.state.appSettings.backgroundColor, minHeight: '100vh' }}>
        <button onClick={this.onOpenDashboard}>Open Dashboard</button>
        <button onClick={this.onSaveDashboard}>Save Dashboard</button>
        <button onClick={this.onOpenPrefsEditor}>Settings</button>
        <button onClick={this.onNewLayout}>Reset Layout</button>
        <button onClick={this.onCompactTypeChange}>
          {this.state.compactType || "No"}{` Compaction`}
        </button>
        <button onClick={this.toggleTimerClick}>{this.state.timer.isOn ? "Stop AutoFetch" : "Start AutoFetch"}</button>
        {/* <span>
          Current Breakpoint: {this.state.currentBreakpoint} ({
            this.props.cols[this.state.currentBreakpoint]
          }{" "}
          columns)
        </span> */}

        <Modal modalProps={{ btnText: "Dashboard Config", btnClass: "add_widget_btn" }} modalContent={this.AppSettingsModalContent()} />
        <Modal modalProps={{ btnText: "Add Widget", btnClass: "add_widget_btn" }} modalContent={this.AddWidgetModalContent()} />
        <button onClick={this.onRefreshAll}>Refresh</button>

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
          style={divStyle}
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
    // let fromVarTime = new VarTime();
    // fromVarTime.absoluteTime = (new Date().getTime()) - 2 * 60 * 60 * 1000;

    // let seriesProps: ITslpSeriesProps = {
    //   title: `Series ${ind + 1}`,
    //   renderStrategy: PlotlyRenderStrategy.scatter,
    //   color: "blue",
    //   meas: new ScadaMeasurement(),
    //   fromVarTime: fromVarTime,
    //   toVarTime: new VarTime(),
    //   displayTimeShift: new DisplayTimeShift(),
    //   points: []
    // }
    let contentProps: TslpProps = new TslpProps();
    contentProps.seriesList = [];
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
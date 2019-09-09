import { IDashWidgetProps } from './dash_widget/IDashWidgetState';
import { ITimePeriod } from './ITimeSeriesLinePlot';
export interface LayoutItem {
    x: number,
    y: number,
    w: number,
    h: number,
    i: string,
    static: boolean
}

export interface Layout extends Array<LayoutItem> { }

export interface AppProps {
    className: string,
    rowHeight: number,
    onLayoutChange: (currLayout: Layout, allLayouts: any) => {},
    cols: { lg: number, md: number, sm: number, xs: number, xxs: number },
    initialLayout: Layout,
    appSettings: {
        scadaServerBase: string,
        scadaServerPath: string,
        scadaServerPort: number,
        pmuServerBase: string,
        pmuServerPort: number,
        pmuServerPath: string,
        pmuSoapHost: string,
        pmuSoapPort: number,
        pmuSoapPath: string,
        pmuSoapUsername: string,
        pmuSoapPassword: string,
        timerOn: boolean,
        timerPeriodicity: ITimePeriod
    },
    widgetProps: IDashWidgetProps[]
}

export interface AppState {
    currentBreakpoint: string,
    compactType: string,
    mounted: boolean,
    timer: {
        isOn: boolean,
        start: number,
        busy: boolean
    },
    appSettings: {
        scadaServerBase: string,
        scadaServerPath: string,
        scadaServerPort: number,
        pmuServerBase: string,
        pmuServerPort: number,
        pmuServerPath: string,
        pmuSoapHost: string,
        pmuSoapPort: number,
        pmuSoapPath: string,
        pmuSoapUsername: string,
        pmuSoapPassword: string,
        timerOn: boolean,
        timerPeriodicity: ITimePeriod
    },
    widgetProps: IDashWidgetProps[]
}
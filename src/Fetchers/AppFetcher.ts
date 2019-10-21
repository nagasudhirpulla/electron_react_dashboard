import { VarTime } from "../variable_time/VariableTime";
import { IMeasurement } from "../measurements/IMeasurement";
import { ITslpDataPoint, TslpProps, ITslpProps, TslpSeriesStyle } from "../components/ITimeSeriesLinePlot";
import { IScadaMeasurement, ScadaMeasurement } from "../measurements/ScadaMeasurement";
import { IDummyMeasurement, DummyMeasurement } from "../measurements/DummyMeasurement";
import { AppState } from "../components/IApp";
import { EdnaTslpFetcher } from "./EdnaTslpFetcher";
import { PMUSoapTslpFetcher } from "./PMUSoapTslpFetcher";
import { DummyTslpFetcher } from "./DummyTslpFetcher";
import { WbesTslpFetcher } from "./WbesTslpFetcher";
import { DataAdapterTslpFetcher } from "./DataAdapterTslpFetcher";
import { IDashWidgetProps } from './../components/dash_widget/IDashWidgetState';
import { PMUMeasurement, IPMUMeasurement } from "../measurements/PMUMeasurement";
import { WbesMeasurement, IWbesMeasurement } from "../measurements/WbesMeasurement";
import { AdapterMeasurement, IAdapterMeasurement } from "../measurements/AdapterMeasurement";
import { convertToDurationPnts } from "../utils/duration_plot_utils";
import { ITsscProps, TsscProps, ITsscDataPoint } from "../components/ITimeSeriesScatterPlot";
import { TsTextProps, ITsTextProps, TextComputationStrategy } from './../components/ITimeSeriesText';
import { getPercentileFromArray } from "../utils/stats_utils";

export class AppFetcher {
    appSettings: AppState["appSettings"];
    scadaFetcher: EdnaTslpFetcher = new EdnaTslpFetcher();
    pmuFetcher: PMUSoapTslpFetcher = new PMUSoapTslpFetcher();
    dummyFetcher: DummyTslpFetcher = new DummyTslpFetcher();
    wbesFetcher: WbesTslpFetcher = new WbesTslpFetcher();
    adapterFetcher: DataAdapterTslpFetcher = new DataAdapterTslpFetcher();

    setAppSettings = (settings: AppState["appSettings"]): void => {
        this.appSettings = JSON.parse(JSON.stringify(settings));
        // init pmu soap settings
        this.pmuFetcher.host = this.appSettings.pmuSoapHost;
        this.pmuFetcher.port = this.appSettings.pmuSoapPort;
        this.pmuFetcher.path = this.appSettings.pmuSoapPath;
        this.pmuFetcher.username = this.appSettings.pmuSoapUsername;
        this.pmuFetcher.password = this.appSettings.pmuSoapPassword;
        this.pmuFetcher.refMeasId = this.appSettings.pmuSoapRefMeasId;
    }

    fetchTslpData = async (fromVarTime: VarTime, toVarTime: VarTime, meas: IMeasurement): Promise<ITslpDataPoint[]> => {
        let pnts: ITslpDataPoint[] = []
        if (meas.discriminator == ScadaMeasurement.typename) {
            meas = meas as IScadaMeasurement;
            pnts = await this.scadaFetcher.fetchData(fromVarTime, toVarTime, meas as IScadaMeasurement);
        }
        else if (meas.discriminator == PMUMeasurement.typename) {
            pnts = await this.pmuFetcher.fetchData(fromVarTime, toVarTime, meas as IPMUMeasurement);
        }
        else if (meas.discriminator == DummyMeasurement.typename) {
            pnts = await this.dummyFetcher.fetchData(fromVarTime, toVarTime, meas as IDummyMeasurement);
        }
        else if (meas.discriminator == WbesMeasurement.typename) {
            pnts = await this.wbesFetcher.fetchData(fromVarTime, toVarTime, meas as IWbesMeasurement);
        }
        else if (meas.discriminator == AdapterMeasurement.typename) {
            pnts = await this.adapterFetcher.fetchData(fromVarTime, toVarTime, meas as IAdapterMeasurement);
        }
        return pnts;
    }

    refreshWidgetData = async (inpWp: IDashWidgetProps): Promise<IDashWidgetProps> => {
        let wp = { ...inpWp };
        if (wp.contentProps.discriminator == TslpProps.typename) {
            const tslpProps: ITslpProps = wp.contentProps as ITslpProps;
            for (let seriesIter = 0; seriesIter < tslpProps.seriesList.length; seriesIter++) {
                let series = tslpProps.seriesList[seriesIter];
                let pnts: ITslpDataPoint[] = await this.fetchTslpData(series.fromVarTime, series.toVarTime, series.meas);
                // convert to duration plot if required
                if (series.seriesStyle == TslpSeriesStyle.duration) {
                    pnts = convertToDurationPnts(pnts);
                }
                // fetch the timeseries data
                (wp.contentProps as TslpProps).seriesList[seriesIter].points = pnts;
            }
        } else if (wp.contentProps.discriminator == TsscProps.typename) {
            const tsscProps: ITsscProps = wp.contentProps as ITsscProps;
            for (let seriesIter = 0; seriesIter < tsscProps.seriesList.length; seriesIter++) {
                let series = tsscProps.seriesList[seriesIter];
                let pntsX: ITslpDataPoint[] = await this.fetchTslpData(series.fromVarTime, series.toVarTime, series.meas1);
                let pntsY: ITslpDataPoint[] = await this.fetchTslpData(series.fromVarTime, series.toVarTime, series.meas2);
                let pnts: ITsscDataPoint[] = [];
                // here we assume that we get the same timestamps for both measurements meas1 and meas2
                // todo do time alignment for pntsX and pntsY
                for (let pntInd = 0; pntInd < Math.min(pntsX.length, pntsY.length); pntInd++) {
                    const newPnt: ITsscDataPoint = { timestamp: pntsX[pntInd].timestamp, value1: pntsX[pntInd].value, value2: pntsY[pntInd].value };
                    pnts.push(newPnt);
                }
                // fetch the timeseries data
                (wp.contentProps as TsscProps).seriesList[seriesIter].points = pnts;
            }
        } else if (wp.contentProps.discriminator == TsTextProps.typename) {
            const tsTextProps: ITsTextProps = wp.contentProps as ITsTextProps;
            const textStrategy = tsTextProps.textComputationStrategy;
            let pnts: ITslpDataPoint[] = [];
            if (textStrategy != TextComputationStrategy.noData) {
                pnts = await this.fetchTslpData(tsTextProps.fromVarTime, tsTextProps.toVarTime, tsTextProps.meas);
            }
            let val = 0;
            if (pnts.length > 0) {
                if (textStrategy == TextComputationStrategy.firstSample) {
                    val = pnts[0].value;
                } else if (textStrategy == TextComputationStrategy.lastSample) {
                    val = pnts[pnts.length - 1].value;
                } else if ((textStrategy == TextComputationStrategy.average) || (textStrategy == TextComputationStrategy.sum)) {
                    val = 0;
                    for (let pntInd = 0; pntInd < pnts.length; pntInd++) {
                        val += pnts[pntInd].value;
                    }
                    if (textStrategy == TextComputationStrategy.sum) {
                        val = val / pnts.length;
                    }
                } else if (textStrategy == TextComputationStrategy.max) {
                    val = pnts[0].value;
                    for (let pntInd = 0; pntInd < pnts.length; pntInd++) {
                        let pntVal = pnts[pntInd].value;
                        if (val < pntVal) {
                            val = pntVal;
                        }
                    }
                } else if (textStrategy == TextComputationStrategy.min) {
                    val = pnts[0].value;
                    for (let pntInd = 0; pntInd < pnts.length; pntInd++) {
                        let pntVal = pnts[pntInd].value;
                        if (val > pntVal) {
                            val = pntVal;
                        }
                    }
                } else if (textStrategy == TextComputationStrategy.percentile) {
                    let vals: number[] = [];
                    for (let pntInd = 0; pntInd < pnts.length; pntInd++) {
                        vals.push(pnts[pntInd].value);
                    }
                    val = getPercentileFromArray(vals, tsTextProps.percentile);
                }
            }
            (wp.contentProps as TsTextProps).val = val;
        }
        return wp;
    }
}

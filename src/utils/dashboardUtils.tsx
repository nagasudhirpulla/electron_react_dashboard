import { AppState } from "../components/IApp";
import { TslpProps } from "../components/ITimeSeriesLinePlot";

export const stripDataFromAppState = (inpSt: AppState): AppState => {
    let st = JSON.parse(JSON.stringify(inpSt)) as AppState;
    //iterate through App state to find data points
    for (let widIter = 0; widIter < st.widgetProps.length; widIter++) {
        const contType = st.widgetProps[widIter].contentProps.discriminator;
        if (contType == TslpProps.typename) {
            for (let seriesIter = 0; seriesIter < (st.widgetProps[widIter].contentProps as TslpProps).seriesList.length; seriesIter++) {
                (st.widgetProps[widIter].contentProps as TslpProps).seriesList[seriesIter].points = [];
            }
        }
    }
    return st;
}
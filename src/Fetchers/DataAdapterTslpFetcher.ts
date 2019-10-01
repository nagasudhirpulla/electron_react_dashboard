import { VarTime } from "../variable_time/VariableTime";
import { ITslpDataPoint, TimePeriod } from "../components/ITimeSeriesLinePlot";
import { ITslpDataFetcher } from "./IFetcher";
import { ipcRenderer } from "electron";
import * as channels from '../channelNames';
import { IAdapterMeasurement } from "../measurements/AdapterMeasurement";

export class DataAdapterTslpFetcher implements ITslpDataFetcher {
    exeName: string = 'ScadaCsharpNodeAdapter.exe';

    make2Digits = (num: number): string => {
        if (num <= 9 && num >= 0) {
            return '0' + num;
        }
        return '' + num;
    };

    convertTimeToInpStr = (time: Date): string => {
        return `${time.getTime()}`;
    };

    getAdapterRespAsync = (adapterId: string, cmdParams: string[]): Promise<string> => {
        return new Promise((resolve, reject) => {
            ipcRenderer.send(channels.getAdapterData, { adapterId: adapterId, cmdParams: cmdParams });
            ipcRenderer.once(channels.getAdapterDataResp, (event, resp: string) => {
                resolve(resp);
            });
        });
    }

    fetchDataFromIpc = async (fromTime: Date, toTime: Date, measId: string, adapterId: string): Promise<number[]> => {
        const fromTimeStr = this.convertTimeToInpStr(fromTime);
        const toTimeStr = this.convertTimeToInpStr(toTime);
        const cmdParams: string[] = [
            "--meas_id", measId, "--from_time", fromTimeStr, "--to_time", toTimeStr
        ];
        // meas_id, from_time, to_time, host, port, path, username, password, ref_meas_id
        let data: number[] = [];
        try {
            const resp = await this.getAdapterRespAsync(adapterId, cmdParams);
            if (resp != null && resp != "") {
                data = resp.split(',').map((num) => { return +num; });
            }
        }
        catch (e) {
            data = [];
        }

        return data;
    }

    async fetchAdapterData(pnt: IAdapterMeasurement, fromTime: Date, toTime: Date): Promise<ITslpDataPoint[]> {
        let resultData: ITslpDataPoint[] = [];
        if (pnt.adapter_id == null || pnt.adapter_id == "") {
            return resultData;
        }
        try {
            let resVals: number[] = await this.fetchDataFromIpc(fromTime, toTime, pnt.meas_id, pnt.adapter_id);

            for (var i = 0; i < resVals.length / 2; i++) {
                let pntInd = i * 2;
                let dataPnt: ITslpDataPoint = { timestamp: (new Date(resVals[pntInd])).getTime(), value: resVals[pntInd + 1] };
                resultData.push(dataPnt);
            }
        }
        catch (err) {
            console.log(`${err.message}`);
            resultData = [];
        }
        return resultData;
    };

    async fetchData(fromVarTime: VarTime, toVarTime: VarTime, adap_meas: IAdapterMeasurement): Promise<ITslpDataPoint[]> {
        let resultData: ITslpDataPoint[] = []
        const fromTime = VarTime.getDateObj(fromVarTime);
        const toTime = VarTime.getDateObj(toVarTime);

        if (fromTime.getTime() >= toTime.getTime()) {
            return resultData;
        }

        resultData = await this.fetchAdapterData(adap_meas, fromTime, toTime);
        return resultData;
    }
}
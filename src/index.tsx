import { app, BrowserWindow } from 'electron';
import __basedir from './basepath';
// import url from "url";
import path from "path";
import { ipcMain } from 'electron';
import { getPrefsState, getPmuMeasListState } from './appState'
import { getPmuMeasList, refreshPmuMeasList, IPrefs, setAppSettings, initPrefsState } from './appSettings'
import * as channels from './channelNames';
import { initPmuMeasListState } from './appSettings';
import { spawn, ChildProcess } from "child_process";
import { initAdapters, getAdapters, getAdapter } from "./adapters/adapter_state";
import { registerPlugin, unRegisterPlugin, updatePlugin, fetchFromAdapter } from "./adapters/adapter_server";
// import { join } from 'path';
import { AdapterManifest } from './adapters/def_manifest';

let win: BrowserWindow;
let pmuMeasPickerWin: BrowserWindow;
let prefsEditorWin: BrowserWindow;
let dataAdaptersEditorWin: BrowserWindow;
let pickerPmuSeriesName = "";

const createWindow = () => {
    win = new BrowserWindow({
        width: 1340,
        height: 750,
        webPreferences: {
            nodeIntegration: true, webSecurity: false
        }
    });
    win.loadURL(`file://${path.resolve(path.dirname(process.mainModule.filename), 'index.html')}`);
    win.on("closed", () => {
        win = null;
    });
};

const onAppReady = async () => {
    await initPrefsState(app.getAppPath());
    createWindow();
    await initPmuMeasListState(app.getAppPath());
    await initAdapters();
};

const loadPmuMeasPickerWindow = () => {
    if (pmuMeasPickerWin != null) {
        pmuMeasPickerWin.reload();
        pmuMeasPickerWin.focus();
        return;
    }
    pmuMeasPickerWin = new BrowserWindow({
        width: 1150,
        height: 580,
        webPreferences: {
            nodeIntegration: true, webSecurity: false
        }
    });
    pmuMeasPickerWin.loadURL(`file://${path.resolve(path.dirname(process.mainModule.filename), 'pmuMeasPicker.html')}`);
    pmuMeasPickerWin.on("closed", () => {
        pmuMeasPickerWin = null;
    });
};

const getOpenedFilePath = () => {
    let data = null
    if (process.platform == 'win32' && process.argv.length >= 2) {
        var openFilePath = process.argv[1]
        data = openFilePath
    }
    return data
};

app.on("ready", onAppReady);

ipcMain.on(channels.openFileInfo, (event, arg) => {
    // console.log(arg) // prints "ping"
    let data = getOpenedFilePath();
    event.reply(channels.openFileInfoResp, data)
});

ipcMain.on(channels.openPmuMeasPicker, (event, measName) => {
    pickerPmuSeriesName = measName;
    loadPmuMeasPickerWindow();
});

ipcMain.on(channels.getPmuMeasList, async (event, arg) => {
    // console.log(arg) // prints "ping"
    // let data = await getPmuMeasList(app.getAppPath());
    let data = getPmuMeasListState();
    event.reply(channels.getPmuMeasListResp, data)
});

ipcMain.on(channels.openPrefsEditor, (event, arg) => {
    if (prefsEditorWin != null) {
        prefsEditorWin.reload();
        prefsEditorWin.focus();
        return;
    }
    prefsEditorWin = new BrowserWindow({
        width: 450,
        height: 500,
        webPreferences: {
            nodeIntegration: true, webSecurity: false
        }
    });
    prefsEditorWin.loadURL(`file://${path.resolve(path.dirname(process.mainModule.filename), 'preferences.html')}`);
    prefsEditorWin.on("closed", () => {
        prefsEditorWin = null;
    });
});

ipcMain.on(channels.getSettings, async (event, arg) => {
    const appSettings = getPrefsState();
    event.reply(channels.getSettingsResp, appSettings);
});

ipcMain.on(channels.setSettings, async (event, appSettings: IPrefs) => {
    const isSaved = await setAppSettings(app.getAppPath(), appSettings);
    event.reply(channels.setSettingsResp, isSaved);
    // send settings to the dashboard window
    win.webContents.send(channels.getSettingsResp, appSettings);
});

ipcMain.on(channels.selectedPickerMeas, (event, measObj: any) => {
    // console.log(`Obtained pmu meas from picker is ${JSON.stringify(measObj)}`) // prints "pong"
    win.webContents.send(channels.selectedMeas, { measInfo: measObj, measName: pickerPmuSeriesName });
    // close pmu picker picker window
    pmuMeasPickerWin.close();
});

ipcMain.on(channels.refreshPmuMeasList, async (event, arg: any) => {
    await refreshPmuMeasList(app.getAppPath());
    loadPmuMeasPickerWindow();
});

ipcMain.on(channels.getExeData, async (event, args: { exeName: string, cmdParams: string[] }) => {
    const getIpcRespAsync = (ipc: ChildProcess): Promise<string> => {
        return new Promise((resolve, reject) => {
            let res = "";

            ipc.stderr.once('data', function (data) {
                // console.log(data.toString());
                reject(data.toString());
            });

            ipc.stdout.on('data', function (data) {
                // console.log(data.toString());
                // resolve(`result=` + data.toString());
                res += data.toString();
            });

            ipc.once('close', (code: number) => {
                resolve(res);
                // console.log(`Ipc exe to exit with code: ${code}`);
            });
        });
    }
    const exePath = path.resolve(path.dirname(process.mainModule.filename), 'exes', args.exeName);
    const ipc = spawn(exePath, args.cmdParams);
    let resp = null;
    try { resp = await getIpcRespAsync(ipc); }
    catch (ex) { resp = null; }
    event.reply(channels.getExeDataResp, resp);
});

const fetchExeData = async (exeName: string, cmdParams: string[]): Promise<string> => {
    const getIpcRespAsync = (ipc: ChildProcess): Promise<string> => {
        return new Promise((resolve, reject) => {
            let res = "";

            ipc.stderr.once('data', function (data) {
                // console.log(data.toString());
                reject(data.toString());
            });

            ipc.stdout.on('data', function (data) {
                // console.log(data.toString());
                // resolve(`result=` + data.toString());
                res += data.toString();
            });

            ipc.once('close', (code: number) => {
                resolve(res);
                // console.log(`Ipc exe to exit with code: ${code}`);
            });
        });
    }
    const exePath = path.resolve(path.dirname(process.mainModule.filename), 'exes', exeName);
    const ipc = spawn(exePath, cmdParams);
    let resp: string = null;
    try { resp = await getIpcRespAsync(ipc); }
    catch (ex) { resp = null; }
    return resp;
};

ipcMain.on(channels.openScadaMeasPicker, async (event, measName) => {
    const exeName = 'ScadaCsharpNodeAdapter.exe';
    const cmdParams: string[] = ["--request_type", "pick_meas"];
    const resp = await fetchExeData(exeName, cmdParams);
    event.reply(channels.selectedMeas, { measInfo: [resp], measName: measName });
});

ipcMain.on(channels.openDataAdaptersEditor, (event, arg) => {
    if (dataAdaptersEditorWin != null) {
        dataAdaptersEditorWin.reload();
        dataAdaptersEditorWin.focus();
        return;
    }
    dataAdaptersEditorWin = new BrowserWindow({
        width: 450,
        height: 500,
        webPreferences: {
            nodeIntegration: true, webSecurity: false
        }
    });
    dataAdaptersEditorWin.loadURL(`file://${path.resolve(path.dirname(process.mainModule.filename), 'adapters.html')}`);
    dataAdaptersEditorWin.on("closed", () => {
        dataAdaptersEditorWin = null;
    });
});

ipcMain.on(channels.getAdaptersList, (event, inpObj) => {
    const adapters: AdapterManifest[] = Object.values(getAdapters());
    event.reply(channels.getAdaptersListResp, { adapters: adapters });
});

ipcMain.on(channels.addDataAdapter, async (event, inpObj) => {
    const newAdapter = await registerPlugin();
    event.reply(channels.addDataAdapterResp, { newAdapter: newAdapter });
});

ipcMain.on(channels.deleteDataAdapter, async (event, adapterId: string) => {
    const isSuccess = await unRegisterPlugin(adapterId);
    event.reply(channels.deleteDataAdapterResp, { isSuccess: isSuccess });
});

ipcMain.on(channels.updateDataAdapter, async (event, adapterId: string) => {
    const updatedAdapter: AdapterManifest = await updatePlugin(adapterId);
    event.reply(channels.updateDataAdapterResp, { adapter: updatedAdapter });
});

ipcMain.on(channels.getAdapterData, async (event, args: { adapterId: string, cmdParams: string[] }) => {
    const resp = await fetchFromAdapter(args.adapterId, args.cmdParams);
    event.reply(channels.getAdapterDataResp, resp);
});

ipcMain.on(channels.openAdapterMeasPicker, async (event, args: { adapterId: string, measName: string }) => {
    const adapter: AdapterManifest = getAdapter(args.adapterId);
    if (adapter == undefined || adapter == null) {
        event.reply(channels.selectedMeas, { err: "This data adapter is not present. Please reload or check adapters list...", measName: args.measName });
        return;
    }
    else if (adapter.is_meas_picker_present == false) {
        event.reply(channels.selectedMeas, { err: "Measurement picker is not supported in this adapter...", measName: args.measName });
        return;
    }
    const cmdParams: string[] = ["--show_meas_picker"];
    const resp = await fetchFromAdapter(args.adapterId, cmdParams);
    event.reply(channels.selectedMeas, { measInfo: JSON.parse(resp), measName: args.measName });
});

ipcMain.on(channels.openAdapterConfigWindow, async (event, adapterId: string) => {
    const adapter: AdapterManifest = getAdapter(adapterId);
    if (adapter == undefined || adapter == null) {
        event.reply(channels.openAdapterConfigWindowResp, { err: "This data adapter is not present. Please reload or check adapters list..." });
        return;
    }
    else if (adapter.is_meas_picker_present == false) {
        event.reply(channels.openAdapterConfigWindowResp, { err: "Adapter Configuration window is not supported in this adapter..." });
        return;
    }
    const cmdParams: string[] = ["--config_adapter"];
    const resp = await fetchFromAdapter(adapterId, cmdParams);
    event.reply(channels.openAdapterConfigWindowResp, {});
});
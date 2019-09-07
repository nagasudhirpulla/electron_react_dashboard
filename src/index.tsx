import { app, BrowserWindow } from 'electron';
import __basedir from './basepath';
import url from "url";
import path from "path";
import { ipcMain } from 'electron';
import { getAppSettings, getPmuMeasList, refreshPmuMeasList, ISettings, setAppSettings } from './appSettings'
import * as channels from './channelNames';

let win: BrowserWindow;
let pmuMeasPickerWin: BrowserWindow;
let prefsEditorWin: BrowserWindow;
let pickerPmuSeriesName = "";

const createWindow = () => {
    win = new BrowserWindow({
        width: 600,
        height: 800,
        webPreferences: {
            nodeIntegration: true, webSecurity: false
        }
    });
    win.loadURL(`file://${path.resolve(path.dirname(process.mainModule.filename), 'index.html')}`);
    win.on("closed", () => {
        win = null;
    });
};

const loadPmuMeasPickerWindow = () => {
    if (pmuMeasPickerWin != null) {
        pmuMeasPickerWin.reload();
        pmuMeasPickerWin.focus();
        return;
    }
    pmuMeasPickerWin = new BrowserWindow({
        width: 450,
        height: 450,
        webPreferences: {
            nodeIntegration: true, webSecurity: false
        }
    });
    pmuMeasPickerWin.loadURL(`file://${path.resolve(path.dirname(process.mainModule.filename), 'pmuMeasPicker.html')}`);
    pmuMeasPickerWin.on("closed", () => {
        pmuMeasPickerWin = null;
    });
};

const onAppReady = async () => {
    createWindow();
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
    let data = await getPmuMeasList(app.getAppPath());
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
        height: 450,
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
    const appSettings = await getAppSettings(app.getAppPath());
    event.reply(channels.getSettingsResp, appSettings);
});

ipcMain.on(channels.setSettings, async (event, appSettings: ISettings) => {
    const isSaved = await setAppSettings(app.getAppPath(), appSettings);
    event.reply(channels.setSettingsResp, isSaved);
});

ipcMain.on(channels.selectedPickerMeas, (event, measObj: any) => {
    // console.log(`Obtained pmu meas from picker is ${JSON.stringify(measObj)}`) // prints "pong"
    win.webContents.send(channels.selectedMeas, { measInfo: measObj, measName: pickerPmuSeriesName });
});

ipcMain.on(channels.refreshPmuMeasList, async (event, arg: any) => {
    await refreshPmuMeasList(app.getAppPath());
    loadPmuMeasPickerWindow();
});
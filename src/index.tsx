import { app, BrowserWindow } from 'electron';
import __basedir from './basepath';
import url from "url";
import path from "path";
import { ipcMain } from 'electron';
import { getAppSettingsJSON, getPmuMeasList, refreshPmuMeasList } from './appSettings'
import * as channels from './channelNames';

let win: BrowserWindow;
let pmuMeasPickerWin: BrowserWindow;

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

ipcMain.on(channels.openPmuMeasPicker, (event, arg) => {
    loadPmuMeasPickerWindow();
});

ipcMain.on(channels.getPmuMeasList, async (event, arg) => {
    // console.log(arg) // prints "ping"
    let data = await getPmuMeasList(app.getAppPath());
    event.reply(channels.getPmuMeasListResp, data)
});

ipcMain.on(channels.selectedMeas, (event, measObj: any) => {
    // console.log(`Obtained pmu meas from picker is ${JSON.stringify(measObj)}`) // prints "pong"
    win.webContents.send(channels.selectedMeas, measObj);
});

ipcMain.on(channels.refreshPmuMeasList, async (event, arg: any) => {
    await refreshPmuMeasList(app.getAppPath());
    loadPmuMeasPickerWindow();    
});
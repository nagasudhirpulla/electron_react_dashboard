import { app, BrowserWindow } from 'electron';
import __basedir from './basepath';
import url from "url";
import path from "path";
import { ipcMain } from 'electron';
import { getAppSettingsJSON } from './appSettings'

// declare var __dirname, process;

let win;

const createWindow = () => {
    win = new BrowserWindow({
        width: 450,
        height: 450,
        webPreferences: {
            nodeIntegration: true, webSecurity: false
        }
    });
    win.loadURL(`file://${path.resolve(path.dirname(process.mainModule.filename), 'index.html')}`);
    win.on("closed", () => {
        win = null;
    });
};

const createPmuMeasPickerWindow = () => {
    win = new BrowserWindow({
        width: 450,
        height: 450,
        webPreferences: {
            nodeIntegration: true, webSecurity: false
        }
    });
    win.loadURL(`file://${path.resolve(path.dirname(process.mainModule.filename), 'pmuMeasPicker.html')}`);
    win.on("closed", () => {
        win = null;
    });
};

const onAppReady = async () => {
    createWindow();
    createPmuMeasPickerWindow();
    // console.log(await getAppSettingsJSON(app.getAppPath()));
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

ipcMain.on('openFileInfo', (event, arg) => {
    // console.log(arg) // prints "ping"
    let data = getOpenedFilePath();
    event.reply('openFileInfoResp', data)
});
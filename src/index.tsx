import { app, BrowserWindow } from 'electron';
import __basedir from './basepath';
import url from "url";
import path from "path";

// declare var __dirname, process;

let win;

let createWindow = () => {
    win = new BrowserWindow({
        width: 450,
        height: 450
    });
    win.loadURL(`file://${path.resolve(path.dirname(process.mainModule.filename), 'index.html')}`);
    win.on("closed", () => {
        win = null;
    });
}

app.on("ready", createWindow);
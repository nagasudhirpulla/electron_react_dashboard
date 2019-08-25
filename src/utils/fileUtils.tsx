import { readFile, writeFile } from 'fs';
import { Workbook } from 'exceljs';
const showSaveDialog = require('electron').remote.dialog.showSaveDialog;

export const readFileAsync = function (filename: string) {
    return new Promise(function (resolve, reject) {
        readFile(filename, function (err, data) {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
};

export const writeFileAsync = function (filename: string, contents: string) {
    return new Promise(function (resolve, reject) {
        writeFile(filename, contents, function (err) {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });
};

export const saveExcelAsync = async (wb: Workbook) => {
    const dialogRes = await showSaveDialog({
        filters: [
            { name: 'Excel Workbook', extensions: ['xlsx'] },
            { name: 'All Files', extensions: ['*'] }
        ],
        title: 'Export Excel'
    }) as any;
    if (!(dialogRes.cancelled == true)) {
        const saveFilename: string = dialogRes.filePath;
        console.log(`Saving excel to ${saveFilename}`);
        //todo remove points from timeseries line props
        await wb.xlsx.writeFile(saveFilename);
        console.log(`Excel Saved!`);
    }
};
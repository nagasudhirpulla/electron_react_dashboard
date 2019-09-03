import $ from 'jquery';
import 'datatables.net';
require('./css/jquery.dataTables.min.css');
require('./images/sort_asc.png');
require('./images/sort_desc.png');
require('./images/sort_desc_disabled.png');
require('./images/sort_asc_disabled.png');
require('./images/sort_both.png');
import { ipcRenderer } from 'electron';
import { IPmuMeasItem } from '../Fetchers/PmuMeasFetcher';

const renderDataTable = (dataSet: IPmuMeasItem[]) => {
    document.getElementById('measTable').innerHTML = "";
    $('#measTable').DataTable({
        data: dataSet,
        columns: [
            { title: "Meas. Id" },
            { title: "Station" },
            { title: "El. Type" },
            { title: "El. Scada Name" },
            { title: "Meas. Type" },
            { title: "PMU Id" },
            { title: "El. Name" }
        ]
    });
};

ipcRenderer.on('getPmuMeasListResp', (event, measList: IPmuMeasItem[]) => {
    console.log(`Obtained pmu meas list from main process`) // prints "pong"
    let dataSet: IPmuMeasItem[] = measList;
    renderDataTable(dataSet);
});

$(document).ready(function () {
    ipcRenderer.send('getPmuMeasList', 'ping');
});
import $ from 'jquery';
import 'datatables.net';
require('./dataTables.fixedHeader.min.js');
require('./css/jquery.dataTables.min.css');
require('./css/fixedHeader.dataTables.min.css');
require('./images/sort_asc.png');
require('./images/sort_desc.png');
require('./images/sort_desc_disabled.png');
require('./images/sort_asc_disabled.png');
require('./images/sort_both.png');
import { ipcRenderer } from 'electron';
import { IPmuMeasItem } from '../Fetchers/PmuMeasFetcher';
import * as channelNames from '../channelNames';


const renderDataTable = (dataSet: IPmuMeasItem[]) => {
    let table = $('#measTable').DataTable({
        data: dataSet,
        orderCellsTop: true,
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

    $('#measTable thead tr').clone(true).appendTo('#measTable thead');
    $('#measTable thead tr:eq(1) th').each(function (i) {
        var title = $(this).text();
        $(this).html('<input type="text" placeholder="Search ' + title + '" />');

        $('input', this).on('keyup change', function () {
            if (table.column(i).search() !== this.value) {
                table
                    .column(i)
                    .search(this.value)
                    .draw();
            }
        });
    });

    $('#measTable tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    $('#selectBtn').click(function () {
        // table.row('.selected').remove().draw( false );
        const idEl = $('tr.selected>td');
        if (idEl.length != 0) {
            console.log(`Selected meas Id is ${idEl[0].innerText}`);
            const selectedMeas = parseInt(idEl[0].innerText);
            ipcRenderer.send(channelNames.selectedMeas, selectedMeas);
        }
    });

    $('#refreshBtn').click(function () {
        ipcRenderer.send(channelNames.refreshPmuMeasList, "");
    });

};

ipcRenderer.on(channelNames.getPmuMeasListResp, (event, measList: IPmuMeasItem[]) => {
    console.log(`Obtained pmu meas list from main process`) // prints "pong"
    let dataSet: IPmuMeasItem[] = measList;
    renderDataTable(dataSet);
});

$(document).ready(function () {
    ipcRenderer.send(channelNames.getPmuMeasList, 'ping');
});
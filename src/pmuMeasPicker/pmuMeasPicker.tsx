import $ from 'jquery';
import 'datatables.net';
require('./css/jquery.dataTables.min.css');
require('./images/sort_asc.png');
require('./images/sort_desc.png');
require('./images/sort_desc_disabled.png');
require('./images/sort_asc_disabled.png');
require('./images/sort_both.png');

let dataSet = [];
$(document).ready(function () {
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
});
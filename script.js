let dataItem = document.getElementById("data");

const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/13gZJCXrIJ7dBWW-TaZ0c_CDD0pYNnZhVdrQD98VDcQE/edit?usp=sharing';

function initTableTop() {
    Tabletop.init({
        key: publicSpreadsheetUrl,
        callback: onGetDataFromSpreadsheet
    })
}

function onGetDataFromSpreadsheet(data) {
    let output = '';

    for (let [key, value] of Object.entries(data)) {
        output += '<div class="table-container">';
        output += '<h5 class="table-name">';
        output += key;
        output += '</h5>';
        output += '<div class="table-data">';
        output += JSON.stringify(value.all());
        output += '</div>';
        output += '</div>';
    }

    dataItem.innerHTML = output;
}

window.addEventListener('DOMContentLoaded', initTableTop)
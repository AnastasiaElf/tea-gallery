let dataItem = document.getElementById("data");

const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/13gZJCXrIJ7dBWW-TaZ0c_CDD0pYNnZhVdrQD98VDcQE/edit?usp=sharing';

const KEYS_MAP = {
    NAME: "Название",
    BREWING_TIME: "Время заваривания",
    TEMPERATURE: "Температура воды",
    RATING: "Оценка",
    REVIEW: "Отзыв",
    COST: "Цена за 50г",
}

let tableTopData = null;

function initTableTop() {
    Tabletop.init({
        key: publicSpreadsheetUrl,
        callback: onGetDataFromSpreadsheet
    })
}

function onGetDataFromSpreadsheet(data) {
    let output = '';

    tableTopData = data;

    for (let [key, value] of Object.entries(tableTopData)) {
        output += '<div class="table-container">';
        output += '<h5 class="table-name">';
        output += key;
        output += '</h5>';
        output += '<div class="table-data">';

        let teasArray = value.all();

        teasArray.forEach(teaData => {
            output += '<div class="tea-card">';
            output += '<h6 class="tea-name">';
            output += teaData[KEYS_MAP.NAME];
            output += '</h6>';
            output += '<div class="tea-param">';
            output += "<b>" + KEYS_MAP.BREWING_TIME + "</b>: ";
            output += teaData[KEYS_MAP.BREWING_TIME] ? teaData[KEYS_MAP.BREWING_TIME] + "c" : "---";
            output += '</div>';
            output += '<div class="tea-param">';
            output += "<b>" + KEYS_MAP.TEMPERATURE + "</b>: ";
            output += teaData[KEYS_MAP.TEMPERATURE] ? teaData[KEYS_MAP.TEMPERATURE] + "°C" : "---";
            output += '</div>';
            output += '<div class="tea-param">';
            output += "<b>" + KEYS_MAP.COST + "</b>: ";
            output += teaData[KEYS_MAP.COST] ? teaData[KEYS_MAP.COST] + " BYN" : "---";
            output += '</div>';
            output += '<div class="tea-param">';
            output += "<b>" + KEYS_MAP.RATING + "</b>: ";
            output += teaData[KEYS_MAP.RATING] ? teaData[KEYS_MAP.RATING] + "/5" : "---";
            output += '</div>';
            output += '<div class="tea-param">';
            output += "<b>" + KEYS_MAP.REVIEW + "</b>: ";
            output += teaData[KEYS_MAP.REVIEW] || "---";
            output += '</div>';
            output += '</div>';
        });
        output += '</div>';
        output += '</div>';
    }

    dataItem.innerHTML = output;
}

window.addEventListener('DOMContentLoaded', initTableTop)
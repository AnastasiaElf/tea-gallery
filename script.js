let dataItem = document.getElementById("data");

const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/13gZJCXrIJ7dBWW-TaZ0c_CDD0pYNnZhVdrQD98VDcQE/edit?usp=sharing';

const CATEGORIES_MAP = {
    GREEN: "Зеленый",
    RED: "Красный",
    WHITE: "Белый",
    JAPANESE: "Японский",
    SHU: "Шу",
    SHEN: "Шен",
    OOLONG: "Улун",
    OTHERS: "НеЧай",
}

const CATEGORIES_CLASSNAMES_MAP = {
    [CATEGORIES_MAP.GREEN]: "green",
    [CATEGORIES_MAP.RED]: "red",
    [CATEGORIES_MAP.WHITE]: "white",
    [CATEGORIES_MAP.JAPANESE]: "japanese",
    [CATEGORIES_MAP.SHU]: "shu",
    [CATEGORIES_MAP.SHEN]: "shen",
    [CATEGORIES_MAP.OOLONG]: "oolong",
    [CATEGORIES_MAP.OTHERS]: "others",
}

const KEYS_MAP = {
    NAME: "Название",
    BREWING_TIME: "Время заваривания",
    TEMPERATURE: "Температура воды",
    TABLEWARE: "Посуда",
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

    let categoriesArray = Object.values(CATEGORIES_MAP);
    categoriesArray.sort();

    categoriesArray.forEach((key) => {
        let value = tableTopData[key];

        output += '<div class="table-container">';
        output += '<h5 class="table-name">';
        output += key;
        output += '</h5>';
        output += '<div class="table-data">';

        let teasArray = value.all();

        teasArray.forEach(teaData => {
            output += '<div class="tea-card tea-category-' + CATEGORIES_CLASSNAMES_MAP[key] + '">';
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
            output += "<b>" + KEYS_MAP.TABLEWARE + "</b>: ";
            output += teaData[KEYS_MAP.TABLEWARE] ? teaData[KEYS_MAP.TABLEWARE] : "---";
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
            output += getCardCategoryIcon(key);
            output += '</div>';
        });
        output += '</div>';
        output += '</div>';
    });

    dataItem.innerHTML = output;
}

function getCardCategoryIcon(category) {
    let result = '';
    result += '<div class="tea-category-icon-container tea-category-' + CATEGORIES_CLASSNAMES_MAP[category] + '">';
    result += '<svg class="tea-category-icon" viewBox="0 0 72.51 96.47">';
    result += '<path d="M53,0s8.52,20.85-28,34.85C5.19,42.46-10.06,62,8.15,92.08c1.5-13.46,8-43.15,35.76-49.92,0,0-25.87,9.67-28.15,53.46,13.29,1.86,44.46,3.12,53.72-23.94C81.7,35.94,53,0,53,0"/>';
    result += '</svg>';
    result += '</div>';
    return result;
}

window.addEventListener('DOMContentLoaded', initTableTop)
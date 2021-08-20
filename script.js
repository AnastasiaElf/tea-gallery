const CATEGORIES_MAP = {
    GREEN: "Зеленый",
    RED: "Красный",
    WHITE: "Белый",
    JAPANESE: "Японский",
    SHU: "Шу",
    SHEN: "Шен",
    OOLONG: "Улун",
    OTHERS: "НеЧай",
    MATI: "Мате",
    BLACK: "Черный",
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
    [CATEGORIES_MAP.MATI]: "mati",
    [CATEGORIES_MAP.BLACK]: "black",
}

const CATEGORIES_COLOR = {
    [CATEGORIES_MAP.GREEN]: "#009245",
    [CATEGORIES_MAP.RED]: "#e0421b",
    [CATEGORIES_MAP.WHITE]: "#cccccc",
    [CATEGORIES_MAP.JAPANESE]: "#709200",
    [CATEGORIES_MAP.SHU]: "#925c00",
    [CATEGORIES_MAP.SHEN]: "#436b26",
    [CATEGORIES_MAP.OOLONG]: "#00b3ad",
    [CATEGORIES_MAP.OTHERS]: "#80559c",
    [CATEGORIES_MAP.MATI]: "#93e22b",
    [CATEGORIES_MAP.BLACK]: "#131313",
}

const KEYS_MAP = {
    CATEGORY: "Вид",
    NAME: "Название",
    BREWING_TIME: "Время заваривания",
    TEMPERATURE: "Температура воды",
    TABLEWARE: "Посуда",
    RATING: "Оценка",
    REVIEW: "Отзыв",
    COST: "Цена за 50г",
    TAGS: "Теги",
    IN_STOCK: "В наличии"
}

const TABLEWARE = {
    CLAY: "Глина",
    PORCELAIN: "Фарфор",
    GLASS: "Стекло",
    TEAPOT: "Заварник",
    THERMOS: "Термос"
}

const TAGS = {
    MORNING: "Утренний",
    EVENING: "Вечерний",
    SPECIAL: "Особый"
}

const ELEMENT_ID = {
    CATEGORIES: "categories",
    SEARCH_INPUT: "search_input",
    SEARCH_BUTTON: "search_button",
    SEARCH_CLEAR_BUTTON: "search_clear_button",
    TAGS: "tags",
    RANDOMIZER_TOGGLER: "randomizer_toggler",
    RANDOMIZER_SUBMIT: "randomizer_submit",
    STOCK_TYPE: "stock_type",
    STATISTICS_TOGGLER: "statistics_toggler",
}

const STOCK_TYPE = {
    ALL: "ALL",
    IN_STOCK: "IN_STOCK",
    OUT_OF_STOCK: "OUT_OF_STOCK"
}

class TeaGallery {
    // container = null;
    // data = null;
    // categoriesData = null;
    // categoryFilter = null;
    // searchFilter = '';
    // searchInputValue = '';
    // tagsData = null;
    // tagsFilterArray = [];
    // isRandomizerEnabled = false;
    // randomizerCategories = null;
    // randomizerTags = null;
    // randomTeaInfo = null;
    // stockType = null;
    // isStatisticsEnabled = false;

    constructor(containerId, spreadsheetUrl) {
        if (!publicSpreadsheetUrl) {
            throw Error("Constructor param spreadsheetUrl is missing")
        }

        if (!containerId) {
            throw Error("Constructor param containerId is missing")
        }

        this.container = document.getElementById(containerId);

        if (!this.container) {
            throw Error("Container is not found");
        }

        this.onGetDataFromSpreadsheet = this.onGetDataFromSpreadsheet.bind(this);
        this.handleChangeSearchValue = this.handleChangeSearchValue.bind(this);
        this.handleChangeSearchFilter = this.handleChangeSearchFilter.bind(this);
        this.handleClearSearchFilter = this.handleClearSearchFilter.bind(this);
        this.handleToggleRandomizer = this.handleToggleRandomizer.bind(this);
        this.handleSubmitRandomizer = this.handleSubmitRandomizer.bind(this);
        this.handleToggleStatistics = this.handleToggleStatistics.bind(this);
        this.getData(spreadsheetUrl);
    }

    getData(spreadsheetUrl) {
        Papa.parse(spreadsheetUrl, {
            download: true,
            header: true,
            complete: this.onGetDataFromSpreadsheet
          })
    }

    onGetDataFromSpreadsheet(data) {
        this.data = {};

        let reducedData = data.data.reduce((result, value) => {
            let category = value[KEYS_MAP.CATEGORY];

            result[category] = result[category] || [];
            result[category].push(value);

            return result;
        }, {})

        Object.values(CATEGORIES_MAP).forEach((category) => {
        let teaList = reducedData[category] || [];
            this.data[category] = {
                name: category,
                teaList: teaList,
                totalAmount: teaList.length,
                inStockAmount: teaList.reduce((sum, tea) => JSON.parse(tea[KEYS_MAP.IN_STOCK].toLowerCase()) ? ++sum : sum, 0),
                outOfStockAmount: teaList.reduce((sum, tea) => !JSON.parse(tea[KEYS_MAP.IN_STOCK].toLowerCase()) ? ++sum : sum, 0),
            };
        });
        this.categoriesData = Object.values(CATEGORIES_MAP).sort();
        this.categoryFilter = null;
        this.searchFilter = '';
        this.searchInputValue = '';
        this.tagsData = Object.values(TAGS).sort();
        this.tagsFilterArray = [];
        this.isRandomizerEnabled = false;
        this.randomizerCategories = [];
        this.randomizerTags = [];
        this.randomTeaInfo = null;
        this.stockType = STOCK_TYPE.ALL;
        this.isStatisticsEnabled = false;

        this.renderContent();
    }

    renderContent() {
        let result = '';

        result += this.renderStatisticsControls();
        result += this.renderStatisticsInfo();
        if (!this.isStatisticsEnabled) {
            result += this.renderCategories();
            result += this.renderStockType();
            result += this.renderTags();
            result += this.renderRandomizerControls();
            result += this.renderSearch();
            result += this.renderCards();
        }

        this.container.innerHTML = result;

        this.addEventListeners();
        this.renderCharts();
    }

    renderCategories() {
        let result = `<div id="${ELEMENT_ID.CATEGORIES}" class="tea-categories-container">`;

        // TODO: remove category type duplication
        this.categoriesData.forEach((category) => {
            let isSelected = this.isRandomizerEnabled ? this.randomizerCategories.includes(category) : this.categoryFilter === category;
            result += `
                <div 
                    class="tea-category-container tea-category-${CATEGORIES_CLASSNAMES_MAP[category]} ${isSelected ? "selected" : ""}"
                    data-category="${category}"
                >
                    <div class="tea-category-icon-container tea-category-${CATEGORIES_CLASSNAMES_MAP[category]} ${isSelected ? "selected" : ""}">
                        <span class="tea-category-icon icon-leaf"></span>
                    </div>
                    <div class="tea-category-name">
                        ${category}
                    </div>
                </div>
            `
        })

        result += '</div>';
        return result;
    }

    renderSearch() {
        if (!this.isRandomizerEnabled) {
            let result = `<div class="tea-search-container">`;
            result += `<input id="${ELEMENT_ID.SEARCH_INPUT}" class="tea-input tea-search-input" type="text" placeholder="Найти..." value="${this.searchInputValue}"></input>`
            result += '<div class="tea-search-buttons-container">';
            result += `<button id="${ELEMENT_ID.SEARCH_BUTTON}" class="tea-button tea-search-button tea-button-margin-right">Найти</button>`
            result += `<button id="${ELEMENT_ID.SEARCH_CLEAR_BUTTON}" class="tea-button tea-search-clear-button">Очистить</button>`
            result += '</div>';
            result += '</div>';
            return result;
        } else {
            return '';
        }
    }

    renderStockType() {
        let result = `<div id="${ELEMENT_ID.STOCK_TYPE}" class="tea-stock-type-container">`;
        result += `<div class="tea-stock-type ${this.stockType === STOCK_TYPE.ALL ? "selected" : ""}" data-stock-type="${STOCK_TYPE.ALL}">Все</div>`;
        result += `<div class="tea-stock-type ${this.stockType === STOCK_TYPE.IN_STOCK ? "selected" : ""}" data-stock-type="${STOCK_TYPE.IN_STOCK}">В наличии</div>`;
        result += `<div class="tea-stock-type ${this.stockType === STOCK_TYPE.OUT_OF_STOCK ? "selected" : ""}" data-stock-type="${STOCK_TYPE.OUT_OF_STOCK}">Не в наличии</div>`;
        result += '</div>';
        return result;
    }

    renderTags() {
        let result = `<div id="${ELEMENT_ID.TAGS}" class="tea-tags-container">`;
        this.tagsData.forEach((tag) => {
            let isSelected = this.isRandomizerEnabled ? this.randomizerTags.includes(tag) : this.tagsFilterArray.includes(tag);
            result += `
                <div 
                    class="tea-tag ${isSelected ? "selected" : ""}"
                    data-tag="${tag}"
                >
                    ${tag}
                </div>
            `;
        })
        result += '</div>';
        return result;
    }

    renderRandomizerControls() {
        let result = `<div class="tea-randomizer-container">`;
        if (this.isRandomizerEnabled) {
            result += `<button id="${ELEMENT_ID.RANDOMIZER_SUBMIT}" class="tea-button tea-button-margin-right">Подобрать чай</button>`;
            result += `<button id="${ELEMENT_ID.RANDOMIZER_TOGGLER}" class="tea-button">Вернуться ко всем чаям</button>`;
        } else {
            result += `<button id="${ELEMENT_ID.RANDOMIZER_TOGGLER}" class="tea-button tea-search-button">Случайный чай</button>`;
        }
        result += '</div>';
        return result;
    }

    renderStatisticsControls() {
        if (!this.isRandomizerEnabled) {
            let result = `<div class="tea-statistics-container">`;
            if (this.isStatisticsEnabled) {
                result += `<button id="${ELEMENT_ID.STATISTICS_TOGGLER}" class="tea-button">Вернуться ко всем чаям</button>`;
            } else {
                result += `<button id="${ELEMENT_ID.STATISTICS_TOGGLER}" class="tea-button">Статистика</button>`;
            }
            result += '</div>';
            return result;
        } else {
            return '';
        }
    }

    renderStatisticsInfo() {
        if (this.isStatisticsEnabled) {
            let result = '<div class="tea-statistics-info-container">';
            result += '<div id="pie-chart-stock" class="chart-container"></div>';
            result += '</div>';
            result += '<div class="tea-statistics-info-container">';
            result += '<div id="pie-chart-all" class="chart-container"></div>';
            result += '<div id="bar-chart-all" class="chart-container"></div>';
            result += '<div id="pie-chart-in-stock" class="chart-container"></div>';
            result += '<div id="bar-chart-in-stock" class="chart-container"></div>';
            result += '<div id="pie-chart-out-of-stock" class="chart-container"></div>';
            result += '<div id="bar-chart-out-of-stock" class="chart-container"></div>';
            result += '</div>';
            return result;
        } else {
            return "";
        }
    }

    renderCards() {
        let result = '';

        let categories = this.categoriesData;
        if (this.isRandomizerEnabled) {
            categories = [this.randomTeaInfo.category];
        } else if (this.categoryFilter) {
            categories = categories.filter((category) => category === this.categoryFilter);
        }

        if (categories.length === 0) {
            result += '<div class="table-container">';
            result += '<div class="table-divider"></div>';
            result += this.getNotFoundMessage();
            result += '</div>';
            return result;
        }

        categories.forEach((category) => {
            let teaArray = this.data[category].teaList;
            if (this.isRandomizerEnabled) {
                teaArray = teaArray ? [teaArray.find((elem) => elem[KEYS_MAP.NAME] === this.randomTeaInfo.name)] : [];
            } else {
                if (this.stockType !== STOCK_TYPE.ALL) {
                    teaArray = teaArray.filter((elem) => {
                        if (this.stockType === STOCK_TYPE.IN_STOCK) {
                            return JSON.parse(elem[KEYS_MAP.IN_STOCK].toLowerCase());
                        } else {
                            return !JSON.parse(elem[KEYS_MAP.IN_STOCK].toLowerCase());
                        }
                    });
                }
                if (this.tagsFilterArray.length > 0) {
                    teaArray = teaArray.filter((elem) => {
                        let teaTags = elem[KEYS_MAP.TAGS].split(",").map(elem => elem.trim());
                        let tagsDiff = this.tagsFilterArray.filter(tag => !teaTags.includes(tag));
                        return tagsDiff.length === 0;
                    });
                }
                teaArray = teaArray.filter((elem) => !this.searchFilter || elem[KEYS_MAP.NAME].toLowerCase().includes(this.searchFilter.toLowerCase())).sort((a, b) => (a[KEYS_MAP.NAME] > b[KEYS_MAP.NAME]) ? 1 : -1);
            }

            if (this.isRandomizerEnabled && teaArray.length < 1) {
                result += '<div class="table-container">';
                result += '<div class="table-divider"></div>';
                result += this.getNotFoundMessage();
                result += '</div>';
                return result;
            }

            if (categories.length > 1 && teaArray.length < 1) {
                return;
            }

            result += '<div class="table-container">';
            result += '<div class="table-divider"></div>';
            result += '<h5 class="table-name">';
            result += category;
            result += ` (${this.data[category].inStockAmount}/${this.data[category].totalAmount})`;
            result += '</h5>';

            if (categories.length === 1 && teaArray.length < 1) {
                result += this.getNotFoundMessage();
                result += '</div>';
                return result;
            }

            result += '<div class="table-data">';

            teaArray.forEach(teaData => {
                result += `<div class="tea-card tea-category-${CATEGORIES_CLASSNAMES_MAP[category]} ${JSON.parse(teaData[KEYS_MAP.IN_STOCK].toLowerCase()) ? "" : "out-of-stock"}">`;
                result += this.getItemRatingInfo(teaData[KEYS_MAP.RATING]);
                result += this.getItemNameInfo(teaData[KEYS_MAP.NAME]);
                result += this.getItemBrewingTimeInfo(teaData[KEYS_MAP.BREWING_TIME]);
                result += this.getItemTemperatureInfo(teaData[KEYS_MAP.TEMPERATURE]);
                result += this.getItemTablewareInfo(teaData[KEYS_MAP.TABLEWARE]);
                result += this.getItemCostInfo(teaData[KEYS_MAP.COST]);
                result += this.getItemTagsInfo(teaData[KEYS_MAP.TAGS]);
                result += this.getItemReviewInfo(teaData[KEYS_MAP.REVIEW]);
                result += this.getCardCategoryIcon(category);
                result += '</div>';
            });
            result += '</div>';
            result += '</div>';
        });

        return result;
    }

    getNotFoundMessage() {
        let result = '';
        result += '<div class="table-no-tea-message">';
        result += 'По вашему запросу ничего не найдено';
        result += '</div>';
        return result;
    }

    getItemRatingInfo(rating) {
        if (!rating) {
            return "";
        }

        let result = '';
        result += '<div class="tea-rating-container">';

        for (let i = 0; i < 5; i++) {
            result += `<span class="icon-star rating-icon ${parseInt(rating) > i ? "filled" : ""}"></span>`;
        }

        result += '</div>';
        return result;
    }

    getItemNameInfo(name) {
        return `<h6 class="tea-name">${name}</h6>`;
    }

    getItemBrewingTimeInfo(time) {
        if (!time) {
            return '<div class="tea-param"><b>' + KEYS_MAP.BREWING_TIME + '</b>: ---</div>';
        }

        let timeArray = time.split("-").map(elem => parseInt(elem));
        let minTime = timeArray[0];
        let maxTime = timeArray[1];

        let timeFrom;
        let timeTo;

        if (maxTime) {
            if (maxTime >= 60) {
                let minutesTo = maxTime % 60 === 0 ? (maxTime / 60).toFixed(0) : (maxTime / 60).toFixed(1);
                timeTo = { value: minutesTo, unit: "мин" };
            } else {
                timeTo = { value: maxTime, unit: "c" };
            }
        }

        if (minTime >= 60) {
            let minutesFrom = minTime % 60 === 0 ? (minTime / 60).toFixed(0) : (minTime / 60).toFixed(1);
            timeFrom = { value: minutesFrom, unit: "мин" };
        } else {
            timeFrom = { value: minTime, unit: "c" };
        }

        let result = "";
        result += '<div class="tea-param">';
        result += "<b>" + KEYS_MAP.BREWING_TIME + "</b>: ";
        result += '<div class="tea-brewing-time-container">';
        result += '<div class="time-bar">';
        result += `<div class="time-bar-overlap" style="width: ${maxTime ? (maxTime < 60 ? maxTime : 100) : (minTime ? (minTime < 60 ? minTime : 100) : 0)}%;"></div>`;
        result += '</div>';
        result += '<div class="time-value">';
        result += timeFrom.value + (timeTo ? (timeFrom.unit !== timeTo.unit ? timeFrom.unit : "") + "-" + timeTo.value + timeTo.unit : timeFrom.unit);
        result += '</div>';
        result += '</div>';
        result += '</div>';
        return result;
    }

    getItemTemperatureInfo(temperature) {
        if (!temperature || temperature > 100) {
            return '<div class="tea-param"><b>' + KEYS_MAP.TEMPERATURE + '</b>: ---</div>';
        }

        let temperatureArray = temperature.split("-").map(elem => parseInt(elem)).sort((a, b) => b - a);

        let result = '';
        result += '<div class="tea-param">';
        result += "<b>" + KEYS_MAP.TEMPERATURE + "</b>: ";
        result += '<div class="tea-temperature-container">';
        result += '<div class="temperature-bar">';
        result += `<div class="temperature-bar-overlap" style="width: ${temperatureArray[0]}%;"></div>`;
        result += '</div>';
        result += '<div class="temperature-value">';
        result += temperature + "°C";
        result += '</div>';
        result += '</div>';
        result += '</div>';
        return result;
    }

    getItemTablewareInfo(tableware) {
        if (!tableware) {
            return '<div class="tea-param"><b>' + KEYS_MAP.TABLEWARE + '</b>: ---</div>';
        }

        let result = '';
        result += '<div class="tea-param">';
        result += "<b>" + KEYS_MAP.TABLEWARE + "</b>: ";
        result += '<div class="tea-tableware-container">';

        let tablewareArray = tableware.split(",").map(elem => elem.trim()).sort();

        // TODO: update icons

        tablewareArray.forEach((elem) => {
            result += '<div class="tea-tableware-icon-container">';
            switch (elem) {
                case TABLEWARE.CLAY:
                    result += `<svg viewBox="0 0 512 512" class="tableware-icon clay">
                                    <path d="m181.62 7.5586 13.264 74.189c-71.938 31.064-126.87 82.4-126.87 82.4h-53.496c57.261 63.185 71.263 143.44 74.09 191.57-0.02345 2e-3 -27.255 2.7448-41.578 6.8066-12.832 3.8498-34.643 15.607-34.643 15.607 7e-3 2e-3 0.01444 4e-3 0.02148 6e-3 0.01435 0.0353 14.349 35.298 60.979 69.035 53.654 38.819 53.165 54.728 63.916 57.27h237.39c10.751-2.541 10.262-18.451 63.916-57.27 46.653-33.754 60.982-69.041 60.982-69.041-5e-3 -2e-3 -21.809-11.76-34.641-15.609-14.311-4.0583-41.492-6.7956-41.562-6.8027 2.8262-48.127 16.828-128.38 74.09-191.57h-53.496s-54.935-51.336-126.87-82.4l13.266-74.19zm-92.977 348.72c0.01582 0.2763 0.02788 0.53837 0.04297 0.8125-0.01505-0.27344-0.02719-0.5369-0.04297-0.8125z" fill="#4e2f18"/>
                                    <path d="m256 7.5586v496.88h118.7c10.751-2.541 10.262-18.451 63.916-57.27 46.653-33.754 60.982-69.041 60.982-69.041-5e-3 -2e-3 -21.809-11.76-34.641-15.609-14.311-4.0583-41.492-6.7956-41.562-6.8027 2.8262-48.127 16.828-128.38 74.09-191.57h-53.496s-54.935-51.336-126.87-82.4l13.266-74.189z" fill="#382211"/>
                                    <g>
                                    <path d="m12.386 378.13s21.81-11.759 34.643-15.609c14.33-4.0636 41.586-6.806 41.586-6.806 1.5054 25.609-0.15595 42.121-0.15595 42.121-24.974-4.8395-50.704-11.218-76.073-19.706z" fill="#2a2a2a" />
                                    <path d="m499.6 378.13s-21.81-11.759-34.643-15.609c-14.33-4.0636-41.586-6.806-41.586-6.806-1.5054 25.609 0.15595 42.121 0.15595 42.121 24.974-4.8395 50.704-11.218 76.073-19.706z" fill="#2a2a2a"/>
                                    <path d="m181.62 0a7.5598 7.5598 0 0 0-7.4414 8.8887l12.23 68.412c-62.458 28.163-110.87 69.925-121.32 79.289h-50.576a7.5598 7.5598 0 0 0-5.6016 12.635c52.901 58.373 67.851 132.24 71.6 179.78-9.1172 1.073-24.792 3.1997-35.549 6.25a7.5598 7.5598 0 0 0-0.10938 0.0332c-14.632 4.3897-36.059 16.195-36.059 16.195a7.5598 7.5598 0 0 0-3.0566 10.256c1.6998 3.8777 17.843 38.737 63.213 71.562 26.421 19.115 39.132 32.258 46.766 41.064 3.8167 4.4034 6.3377 7.7547 9.0938 10.691 2.7561 2.9368 6.3314 5.6998 10.75 6.7442a7.5598 7.5598 0 0 0 1.7383 0.20312h237.39a7.5598 7.5598 0 0 0 1.7383-0.20312c4.4186-1.0444 7.9939-3.8074 10.75-6.7442 2.7561-2.9367 5.2771-6.288 9.0938-10.691 7.6333-8.8069 20.345-21.949 46.766-41.064 46.247-33.46 62.161-69.107 63.322-71.809a7.5598 7.5598 0 0 0 0.23242-0.51367 7.5598 7.5598 0 0 0 0.084-0.21484 7.5598 7.5598 0 0 0 0.14649-0.43946 7.5598 7.5598 0 0 0 0.0644-0.22265 7.5598 7.5598 0 0 0 0.0469-0.18164 7.5598 7.5598 0 0 0 0.01-0.041 7.5598 7.5598 0 0 0 2e-3 -8e-3 7.5598 7.5598 0 0 0 0.0899-0.44531 7.5598 7.5598 0 0 0 0.0312-0.18555 7.5598 7.5598 0 0 0 6e-3 -0.043 7.5598 7.5598 0 0 0 0-2e-3 7.5598 7.5598 0 0 0 0.0508-0.45703 7.5598 7.5598 0 0 0 0.0234-0.69336 7.5598 7.5598 0 0 0-0.0195-0.4629 7.5598 7.5598 0 0 0-0.0215-0.23046 7.5598 7.5598 0 0 0-3.9277-5.8711s-21.426-11.806-36.059-16.195a7.5598 7.5598 0 0 0-0.10937-0.0312c-10.75-3.0485-26.413-5.1744-35.533-6.248 3.7483-47.533 18.698-121.4 71.6-179.78a7.5598 7.5598 0 0 0-5.6016-12.635h-50.579c-10.45-9.3638-58.858-51.128-121.32-79.291l12.232-68.41a7.5598 7.5598 0 0 0-7.4414-8.8887zm9.0293 15.117h130.7l-11.674 65.299a7.5598 7.5598 0 0 0 4.4434 8.2715c48.34 20.874 88.566 50.904 109.36 67.902h-334.96c20.795-16.998 61.021-47.028 109.36-67.902a7.5598 7.5598 0 0 0 4.4453-8.2715zm-159.87 156.59h450.45c-60.453 75.866-66.453 169.27-66.016 208.22 3e-3 0.33931 6e-3 0.67075 0.01 1.002 0.0226 1.582 0.0537 3.1004 0.0937 4.4863 0.0625 2.2962 0.13749 4.3904 0.22265 6.1191-85.593 15.741-158.89 13.272-159.2 13.262-6.2e-4 -2e-5 -0.0527-2e-3 -0.0527-2e-3a7.5598 7.5598 0 0 0-4e-3 0 7.5598 7.5598 0 0 0-0.23437-6e-3 7.5598 7.5598 0 0 0-0.31641 6e-3 7.5598 7.5598 0 0 0-4e-3 0s-0.0388-2e-5 -0.0391 0c-0.23671 8e-3 -73.594 2.4848-159.23-13.264 0.0756-1.5351 0.14601-3.3181 0.20508-5.3027 1.095-34.132-1.8325-134.15-65.879-214.52zm50.578 192.53c0.40376 11.386 0.32602 18.853 0.05469 24.408-13.594-2.8114-27.341-6.0614-41.09-9.8926-1.2749-0.35618-2.55-0.71627-3.8242-1.082-1.2725-0.36484-2.5442-0.72626-3.8164-1.1016 5.8722-2.739 12.033-5.4532 16.477-6.791 9.4469-2.6691 23.728-4.5234 32.199-5.541zm349.27 0c8.4739 1.018 22.766 2.8727 32.211 5.543 4.4428 1.3387 10.596 4.0505 16.463 6.7871-1.6972 0.50068-3.3941 0.98658-5.0918 1.4688-0.55724 0.15849-1.1145 0.316-1.6719 0.47266-14.04 3.9386-28.082 7.2656-41.965 10.137-0.0505-1.0329-0.0859-2.2108-0.1211-3.3887-0.0298-1.1214-0.0521-2.3224-0.0703-3.5859-0.011-0.8389-0.0269-1.6331-0.0293-2.5469-2e-3 -0.34827 1e-3 -0.73467 0-1.0918 5e-3 -3.8669 0.0827-8.3599 0.27539-13.795zm52.973 26.834c-8.4363 12.682-23.575 31.273-49.42 49.973-27.233 19.703-41.103 33.924-49.326 43.412-4.1118 4.744-6.8407 8.2739-8.6934 10.248-1.501 1.5994-2.0614 1.9536-2.7227 2.1758h-234.88c-0.66124-0.22217-1.2216-0.57637-2.7227-2.1758-1.8527-1.9741-4.5816-5.5041-8.6934-10.248-8.2236-9.4879-22.093-23.709-49.326-43.412-25.84-18.695-40.977-37.283-49.414-49.965 11.846 3.4948 23.694 6.5526 35.449 9.2559 0.66523 0.15346 1.3316 0.30983 1.9961 0.46094 1.6403 0.37181 3.2762 0.73596 4.9121 1.0938 1.4701 0.32254 2.9368 0.63798 4.4023 0.94922 1.202 0.25452 2.4045 0.5106 3.6035 0.75781 2.6731 0.5526 5.3384 1.0894 7.9922 1.6055 0.02146 4e-3 0.043 0.01 0.06445 0.0137a7.5598 7.5598 0 0 0 0.19726 0.041c0.05294 0.0103 0.10527 0.019 0.1582 0.0293 0.0059 1e-3 0.01171 3e-3 0.01758 4e-3 2.7551 0.53321 5.4997 1.0489 8.2305 1.5449 86.521 15.737 159.8 13.1 160.57 13.072 0.77117 0.0282 74.032 2.6646 160.54-13.066 2.7478-0.49967 5.5087-1.0173 8.2812-1.5547 0.0529-0.0102 0.10526-0.019 0.15821-0.0293a7.5598 7.5598 0 0 0 0.22656-0.0469 7.5598 7.5598 0 0 0 0.0117-2e-3c2.7478-0.53424 5.5088-1.0926 8.2773-1.666 0.94773-0.19581 1.8981-0.39922 2.8477-0.59961 1.7775-0.37604 3.5575-0.75968 5.3418-1.1523 1.3363-0.29329 2.6725-0.58797 4.0117-0.89063 1.2536-0.28404 2.5095-0.57864 3.7656-0.87109 6.2245-1.4454 12.472-2.9975 18.734-4.6582 0.33086-0.0879 0.66128-0.17521 0.99219-0.26367 2.2734-0.60712 4.547-1.2262 6.8223-1.8633 0.22526-0.0631 0.45051-0.12801 0.67578-0.1914 2.3056-0.64865 4.6102-1.3001 6.916-1.9805z"/>
                                    </g>
                            </svg>`;

                    break;

                case TABLEWARE.PORCELAIN:
                    result += `<svg viewBox="0 0 512 512" class="tableware-icon porcelain">
                                    <path d="m181.62 7.5586 13.264 74.189c-71.938 31.064-126.87 82.4-126.87 82.4h-53.496c57.261 63.185 71.263 143.44 74.09 191.57-0.02345 2e-3 -27.255 2.7448-41.578 6.8066-12.832 3.8498-34.643 15.607-34.643 15.607 7e-3 2e-3 0.01444 4e-3 0.02148 6e-3 0.01435 0.0353 14.349 35.298 60.979 69.035 53.654 38.819 53.165 54.728 63.916 57.27h237.39c10.751-2.541 10.262-18.451 63.916-57.27 46.653-33.754 60.982-69.041 60.982-69.041-5e-3 -2e-3 -21.809-11.76-34.641-15.609-14.311-4.0583-41.492-6.7956-41.562-6.8027 2.8262-48.127 16.828-128.38 74.09-191.57h-53.496s-54.935-51.336-126.87-82.4l13.266-74.19zm-92.977 348.72c0.01582 0.2763 0.02788 0.53837 0.04297 0.8125-0.01505-0.27344-0.02719-0.5369-0.04297-0.8125z" fill="#f5f5f5"/>
                                    <path d="m256 7.5586v496.88h118.7c10.751-2.541 10.262-18.451 63.916-57.27 46.653-33.754 60.982-69.041 60.982-69.041-5e-3 -2e-3 -21.809-11.76-34.641-15.609-14.311-4.0583-41.492-6.7956-41.562-6.8027 2.8262-48.127 16.828-128.38 74.09-191.57h-53.496s-54.935-51.336-126.87-82.4l13.266-74.189z" fill="#e4e4e4"/>
                                    <g>
                                    <path d="m12.386 378.13s21.81-11.759 34.643-15.609c14.33-4.0636 41.586-6.806 41.586-6.806 1.5054 25.609-0.15595 42.121-0.15595 42.121-24.974-4.8395-50.704-11.218-76.073-19.706z" fill="#8c8c8c" />
                                    <path d="m499.6 378.13s-21.81-11.759-34.643-15.609c-14.33-4.0636-41.586-6.806-41.586-6.806-1.5054 25.609 0.15595 42.121 0.15595 42.121 24.974-4.8395 50.704-11.218 76.073-19.706z" fill="#8c8c8c"/>
                                    <path d="m181.62 0a7.5598 7.5598 0 0 0-7.4414 8.8887l12.23 68.412c-62.458 28.163-110.87 69.925-121.32 79.289h-50.576a7.5598 7.5598 0 0 0-5.6016 12.635c52.901 58.373 67.851 132.24 71.6 179.78-9.1172 1.073-24.792 3.1997-35.549 6.25a7.5598 7.5598 0 0 0-0.10938 0.0332c-14.632 4.3897-36.059 16.195-36.059 16.195a7.5598 7.5598 0 0 0-3.0566 10.256c1.6998 3.8777 17.843 38.737 63.213 71.562 26.421 19.115 39.132 32.258 46.766 41.064 3.8167 4.4034 6.3377 7.7547 9.0938 10.691 2.7561 2.9368 6.3314 5.6998 10.75 6.7442a7.5598 7.5598 0 0 0 1.7383 0.20312h237.39a7.5598 7.5598 0 0 0 1.7383-0.20312c4.4186-1.0444 7.9939-3.8074 10.75-6.7442 2.7561-2.9367 5.2771-6.288 9.0938-10.691 7.6333-8.8069 20.345-21.949 46.766-41.064 46.247-33.46 62.161-69.107 63.322-71.809a7.5598 7.5598 0 0 0 0.23242-0.51367 7.5598 7.5598 0 0 0 0.084-0.21484 7.5598 7.5598 0 0 0 0.14649-0.43946 7.5598 7.5598 0 0 0 0.0644-0.22265 7.5598 7.5598 0 0 0 0.0469-0.18164 7.5598 7.5598 0 0 0 0.01-0.041 7.5598 7.5598 0 0 0 2e-3 -8e-3 7.5598 7.5598 0 0 0 0.0899-0.44531 7.5598 7.5598 0 0 0 0.0312-0.18555 7.5598 7.5598 0 0 0 6e-3 -0.043 7.5598 7.5598 0 0 0 0-2e-3 7.5598 7.5598 0 0 0 0.0508-0.45703 7.5598 7.5598 0 0 0 0.0234-0.69336 7.5598 7.5598 0 0 0-0.0195-0.4629 7.5598 7.5598 0 0 0-0.0215-0.23046 7.5598 7.5598 0 0 0-3.9277-5.8711s-21.426-11.806-36.059-16.195a7.5598 7.5598 0 0 0-0.10937-0.0312c-10.75-3.0485-26.413-5.1744-35.533-6.248 3.7483-47.533 18.698-121.4 71.6-179.78a7.5598 7.5598 0 0 0-5.6016-12.635h-50.579c-10.45-9.3638-58.858-51.128-121.32-79.291l12.232-68.41a7.5598 7.5598 0 0 0-7.4414-8.8887zm9.0293 15.117h130.7l-11.674 65.299a7.5598 7.5598 0 0 0 4.4434 8.2715c48.34 20.874 88.566 50.904 109.36 67.902h-334.96c20.795-16.998 61.021-47.028 109.36-67.902a7.5598 7.5598 0 0 0 4.4453-8.2715zm-159.87 156.59h450.45c-60.453 75.866-66.453 169.27-66.016 208.22 3e-3 0.33931 6e-3 0.67075 0.01 1.002 0.0226 1.582 0.0537 3.1004 0.0937 4.4863 0.0625 2.2962 0.13749 4.3904 0.22265 6.1191-85.593 15.741-158.89 13.272-159.2 13.262-6.2e-4 -2e-5 -0.0527-2e-3 -0.0527-2e-3a7.5598 7.5598 0 0 0-4e-3 0 7.5598 7.5598 0 0 0-0.23437-6e-3 7.5598 7.5598 0 0 0-0.31641 6e-3 7.5598 7.5598 0 0 0-4e-3 0s-0.0388-2e-5 -0.0391 0c-0.23671 8e-3 -73.594 2.4848-159.23-13.264 0.0756-1.5351 0.14601-3.3181 0.20508-5.3027 1.095-34.132-1.8325-134.15-65.879-214.52zm50.578 192.53c0.40376 11.386 0.32602 18.853 0.05469 24.408-13.594-2.8114-27.341-6.0614-41.09-9.8926-1.2749-0.35618-2.55-0.71627-3.8242-1.082-1.2725-0.36484-2.5442-0.72626-3.8164-1.1016 5.8722-2.739 12.033-5.4532 16.477-6.791 9.4469-2.6691 23.728-4.5234 32.199-5.541zm349.27 0c8.4739 1.018 22.766 2.8727 32.211 5.543 4.4428 1.3387 10.596 4.0505 16.463 6.7871-1.6972 0.50068-3.3941 0.98658-5.0918 1.4688-0.55724 0.15849-1.1145 0.316-1.6719 0.47266-14.04 3.9386-28.082 7.2656-41.965 10.137-0.0505-1.0329-0.0859-2.2108-0.1211-3.3887-0.0298-1.1214-0.0521-2.3224-0.0703-3.5859-0.011-0.8389-0.0269-1.6331-0.0293-2.5469-2e-3 -0.34827 1e-3 -0.73467 0-1.0918 5e-3 -3.8669 0.0827-8.3599 0.27539-13.795zm52.973 26.834c-8.4363 12.682-23.575 31.273-49.42 49.973-27.233 19.703-41.103 33.924-49.326 43.412-4.1118 4.744-6.8407 8.2739-8.6934 10.248-1.501 1.5994-2.0614 1.9536-2.7227 2.1758h-234.88c-0.66124-0.22217-1.2216-0.57637-2.7227-2.1758-1.8527-1.9741-4.5816-5.5041-8.6934-10.248-8.2236-9.4879-22.093-23.709-49.326-43.412-25.84-18.695-40.977-37.283-49.414-49.965 11.846 3.4948 23.694 6.5526 35.449 9.2559 0.66523 0.15346 1.3316 0.30983 1.9961 0.46094 1.6403 0.37181 3.2762 0.73596 4.9121 1.0938 1.4701 0.32254 2.9368 0.63798 4.4023 0.94922 1.202 0.25452 2.4045 0.5106 3.6035 0.75781 2.6731 0.5526 5.3384 1.0894 7.9922 1.6055 0.02146 4e-3 0.043 0.01 0.06445 0.0137a7.5598 7.5598 0 0 0 0.19726 0.041c0.05294 0.0103 0.10527 0.019 0.1582 0.0293 0.0059 1e-3 0.01171 3e-3 0.01758 4e-3 2.7551 0.53321 5.4997 1.0489 8.2305 1.5449 86.521 15.737 159.8 13.1 160.57 13.072 0.77117 0.0282 74.032 2.6646 160.54-13.066 2.7478-0.49967 5.5087-1.0173 8.2812-1.5547 0.0529-0.0102 0.10526-0.019 0.15821-0.0293a7.5598 7.5598 0 0 0 0.22656-0.0469 7.5598 7.5598 0 0 0 0.0117-2e-3c2.7478-0.53424 5.5088-1.0926 8.2773-1.666 0.94773-0.19581 1.8981-0.39922 2.8477-0.59961 1.7775-0.37604 3.5575-0.75968 5.3418-1.1523 1.3363-0.29329 2.6725-0.58797 4.0117-0.89063 1.2536-0.28404 2.5095-0.57864 3.7656-0.87109 6.2245-1.4454 12.472-2.9975 18.734-4.6582 0.33086-0.0879 0.66128-0.17521 0.99219-0.26367 2.2734-0.60712 4.547-1.2262 6.8223-1.8633 0.22526-0.0631 0.45051-0.12801 0.67578-0.1914 2.3056-0.64865 4.6102-1.3001 6.916-1.9805z"/>
                                    </g>
                            </svg>`;
                    break;

                case TABLEWARE.TEAPOT:
                    result += `<svg viewBox="0 0 512 512" class="tableware-icon teapot">
                                    <g>
                                    <path d="m143.25 40.578s1.1353 22.704 0.94531 50.658l-51.695 4e-3 49.57 50.141c-1.1996 13.331-3.0031 25.632-5.6875 35.061-20 61-49.643 127.65-52 172-7 98 78 156 78 156h193.77s85-58 78-156c-1.9123-35.975-21.78-86.631-39.891-137.04-4.2142-11.73-8.334-23.446-12.109-34.961-3.2621-11.457-5.235-27.138-6.3867-43.781-0.95006-13.729-1.3404-28.113-1.4323-41.323-0.19474-28.02 0.95375-50.759 0.95375-50.759z" fill="#c6f0ff"/>
                                    <path d="m259.27 504.44h96.883s85-58 78-156c-1.9123-35.975-21.78-86.631-39.891-137.04-4.2142-11.73-8.334-23.446-12.109-34.961-3.2621-11.457-5.235-27.138-6.3867-43.781-2.9652-42.848-0.47851-92.082-0.47851-92.082h-116.02z" fill="#91e2ff"/>
                                    <g>
                                    <path d="m173.8 91.236h170.94v259h-170.94z" fill="#f5f5f5"/>
                                    <path d="m302.1 7.5591h57.375v33.02h-57.375z" fill="#8c8c8c"/>
                                    <path d="m375.76 132.56c1.1518 16.643 3.1266 32.324 6.3887 43.781 3.7753 11.515 7.8952 23.231 12.109 34.961 20.62-28.274 51.416-34.164 80.912 2.377l-10.182-74.234z" fill="#8c8c8c" />
                                    <path d="m143.25 40.578c0.83824 17.34 0.94753 34.044 0.95471 50.658l230.13 0.10081c-0.132-16.851 0.22952-33.777 0.95375-50.759z" fill="#707070"/>
                                    <path d="m302.09 0a7.5598 7.5598 0 0 0-7.5586 7.5586v25.461h-151.29a7.5598 7.5598 0 0 0-0.23047 0.0039 7.5598 7.5598 0 0 0-2.6973 0.58594 7.5598 7.5598 0 0 0-0.41993 0.19141 7.5598 7.5598 0 0 0-0.80273 0.45898 7.5591 7.5591 0 0 0-0.18945 0.13086 7.5598 7.5598 0 0 0-2e-3 0 7.5598 7.5598 0 0 0-0.36914 0.27734 7.5591 7.5591 0 0 0-0.17773 0.14648 7.5598 7.5598 0 0 0-2e-3 0 7.5598 7.5598 0 0 0-0.3418 0.30859 7.5591 7.5591 0 0 0-0.16406 0.16406 7.5598 7.5598 0 0 0-2e-3 0 7.5598 7.5598 0 0 0-0.1582 0.16602 7.5598 7.5598 0 0 0 0 2e-3 7.5598 7.5598 0 0 0-0.30274 0.34766 7.5598 7.5598 0 0 0 0 2e-3 7.5591 7.5591 0 0 0-0.0645 0.07812 7.5598 7.5598 0 0 0-0.21679 0.28711 7.5598 7.5598 0 0 0 0 2e-3 7.5591 7.5591 0 0 0-0.0391 0.05469 7.5598 7.5598 0 0 0-0.21875 0.32813 7.5598 7.5598 0 0 0-0.23437 0.39844 7.5598 7.5598 0 0 0-0.20899 0.41211 7.5598 7.5598 0 0 0 0 2e-3 7.5598 7.5598 0 0 0-0.18359 0.42187 7.5598 7.5598 0 0 0 0 2e-3 7.5598 7.5598 0 0 0-0.082 0.21484 7.5598 7.5598 0 0 0-0.14453 0.43945 7.5598 7.5598 0 0 0-0.24024 1.1289 7.5598 7.5598 0 0 0 0 2e-3 7.5598 7.5598 0 0 0-0.0664 0.91992 7.5598 7.5598 0 0 0 0 2e-3 7.5591 7.5591 0 0 0 0 0.08008 7.5598 7.5598 0 0 0 4e-3 0.23047 7.5598 7.5598 0 0 0 4e-3 0.13476c4e-3 0.08432 8e-3 0.16766 0.0117 0.25195 0.0275 0.6674 0.78742 19.273 0.84179 42.482l-44.053 0.0036a7.5598 7.5598 0 0 0-5.375 12.873l47.006 47.547c-1.1684 11.634-2.7796 22.36-4.998 30.182-19.808 60.359-49.748 126.43-52.291 173.67-7.2916 102.52 81.281 162.73 81.281 162.73a7.5598 7.5598 0 0 0 4.2598 1.3144h193.77a7.5598 7.5598 0 0 0 4.2598-1.3144s88.557-60.204 81.283-162.71c-2.0048-37.391-21.248-86.34-38.936-135.32 8.8244-10.87 18.754-16.602 28.861-16.92 10.681-0.33594 23.039 5.2347 36.354 21.123l25.975 189.38a7.5591 7.5591 0 0 0 8.5156 6.4629 7.5591 7.5591 0 0 0 6.4629-8.5176l-26.271-191.54-10.182-74.234a7.5591 7.5591 0 0 0-1.1035-3.0176 7.5598 7.5598 0 0 0-0.25781-0.38282 7.5591 7.5591 0 0 0-0.13867-0.18554 7.5598 7.5598 0 0 0-0.14454-0.17969 7.5591 7.5591 0 0 0-0.14843-0.17773 7.5598 7.5598 0 0 0-0.1543-0.16993 7.5591 7.5591 0 0 0 0-2e-3 7.5598 7.5598 0 0 0-0.16016-0.16602 7.5591 7.5591 0 0 0-0.16601-0.1621 7.5598 7.5598 0 0 0-0.34375-0.3086 7.5591 7.5591 0 0 0-0.54883-0.42187 7.5598 7.5598 0 0 0-2e-3 0 7.5598 7.5598 0 0 0-0.99414-0.58594 7.5591 7.5591 0 0 0-1.5176-0.55273 7.5598 7.5598 0 0 0-0.68164-0.13477 7.5591 7.5591 0 0 0-0.45899-0.0547 7.5598 7.5598 0 0 0-0.0859-8e-3l-82.668-6.3789c-0.64096-11.483-0.93148-23.266-1.0078-34.248-1e-5 -0.0027 2e-5 -0.0051 0-0.0078-0.029-3.7058-0.0256-7.4178-8e-3 -11.133 8e-3 -1.5621 0.0268-3.0358 0.041-4.5391 0.025-2.5866 0.0537-5.1748 0.0996-7.7656 0.0145-0.85277 0.027-1.7183 0.043-2.541 0.11584-5.7097 0.29336-11.432 0.50195-17.16h44.59a7.5591 7.5591 0 0 0 7.5586-7.5605 7.5591 7.5591 0 0 0-7.5586-7.5586h-60.127v-25.461a7.5598 7.5598 0 0 0-7.5603-7.5586zm7.5606 15.117h42.256v17.902h-42.256zm-158.57 33.021h216.35c-0.28085 7.0004-0.68976 18.907-0.69336 35.635l-20.875-0.0098a7.5598 7.5598 0 0 0-1.1348-0.08594h-170.94a7.5598 7.5598 0 0 0-0.44922 0.01367l-21.568-0.0098c-5e-3 -16.676-0.41172-28.552-0.68946-35.543zm-6.9609 50.656a7.5598 7.5598 0 0 0 0.0664 0 7.5598 7.5598 0 0 0 6e-3 0l22.037 0.0098v251.43a7.5598 7.5598 0 0 0 7.5586 7.5586h170.94a7.5598 7.5598 0 0 0 7.5586-7.5586v-251.35l14.572 0.0059c0.17165 11.098 0.56168 22.735 1.3379 34.037a7.5598 7.5598 0 0 0 8e-3 0.15625c0.14717 2.1266 0.30703 4.2379 0.48047 6.3301 2e-3 0.0194 2e-3 0.0392 4e-3 0.0586 0.17 2.0471 0.35449 4.076 0.55273 6.0801 1.2078 12.249 2.9673 23.609 5.6289 32.957a7.5598 7.5598 0 0 0 0.0859 0.28516c3.8096 11.619 7.954 23.4 12.18 35.162 18.16 50.548 37.67 101.3 39.455 134.88a7.5598 7.5598 0 0 0 0.01 0.13867c6.2495 87.493-63.872 141.31-72.943 147.9h-188.8c-9.0716-6.5883-79.193-60.409-72.943-147.9a7.5598 7.5598 0 0 0 0.0098-0.13867c2.2002-41.393 31.454-108.49 51.635-170.04a7.5598 7.5598 0 0 0 0.0859-0.28516c2.9144-10.236 4.7243-22.862 5.9473-36.453a7.5598 7.5598 0 0 0-2.1543-5.9922l-36.846-37.27zm37.227 0.01563 155.82 0.06836v243.8h-155.82zm202.83 41.986 74.141 5.7207 2.8516 20.781 3.4941 25.48c-10.965-8.3906-22.335-12.496-33.525-12.145-12.722 0.40012-24.301 6.347-34.035 15.824-2.628-7.4678-5.3205-14.978-7.7227-22.299-2.4095-8.5074-4.0198-20.529-5.2031-33.363z" />
                                    </g>
                                </g>
                            </svg>`;
                    break;

                case TABLEWARE.GLASS:
                    result += `<svg viewBox="0 0 512 512" class="tableware-icon glass">
                                <path d="m181.62 7.5586 13.264 74.189c-71.938 31.064-126.87 82.4-126.87 82.4h-53.496c57.261 63.185 71.263 143.44 74.09 191.57-0.02345 2e-3 -27.255 2.7448-41.578 6.8066-12.832 3.8498-34.643 15.607-34.643 15.607 7e-3 2e-3 0.01444 4e-3 0.02148 6e-3 0.01435 0.0353 14.349 35.298 60.979 69.035 53.654 38.819 53.165 54.728 63.916 57.27h237.39c10.751-2.541 10.262-18.451 63.916-57.27 46.653-33.754 60.982-69.041 60.982-69.041-5e-3 -2e-3 -21.809-11.76-34.641-15.609-14.311-4.0583-41.492-6.7956-41.562-6.8027 2.8262-48.127 16.828-128.38 74.09-191.57h-53.496s-54.935-51.336-126.87-82.4l13.266-74.19zm-92.977 348.72c0.01582 0.2763 0.02788 0.53837 0.04297 0.8125-0.01505-0.27344-0.02719-0.5369-0.04297-0.8125z" fill="#c6f0ff"/>
                                <path d="m256 7.5586v496.88h118.7c10.751-2.541 10.262-18.451 63.916-57.27 46.653-33.754 60.982-69.041 60.982-69.041-5e-3 -2e-3 -21.809-11.76-34.641-15.609-14.311-4.0583-41.492-6.7956-41.562-6.8027 2.8262-48.127 16.828-128.38 74.09-191.57h-53.496s-54.935-51.336-126.87-82.4l13.266-74.189z" fill="#91e2ff"/>
                                <g>
                                <path d="m12.386 378.13s21.81-11.759 34.643-15.609c14.33-4.0636 41.586-6.806 41.586-6.806 1.5054 25.609-0.15595 42.121-0.15595 42.121-24.974-4.8395-50.704-11.218-76.073-19.706z" fill="#8c8c8c" />
                                <path d="m499.6 378.13s-21.81-11.759-34.643-15.609c-14.33-4.0636-41.586-6.806-41.586-6.806-1.5054 25.609 0.15595 42.121 0.15595 42.121 24.974-4.8395 50.704-11.218 76.073-19.706z" fill="#8c8c8c"/>
                                <path d="m181.62 0a7.5598 7.5598 0 0 0-7.4414 8.8887l12.23 68.412c-62.458 28.163-110.87 69.925-121.32 79.289h-50.576a7.5598 7.5598 0 0 0-5.6016 12.635c52.901 58.373 67.851 132.24 71.6 179.78-9.1172 1.073-24.792 3.1997-35.549 6.25a7.5598 7.5598 0 0 0-0.10938 0.0332c-14.632 4.3897-36.059 16.195-36.059 16.195a7.5598 7.5598 0 0 0-3.0566 10.256c1.6998 3.8777 17.843 38.737 63.213 71.562 26.421 19.115 39.132 32.258 46.766 41.064 3.8167 4.4034 6.3377 7.7547 9.0938 10.691 2.7561 2.9368 6.3314 5.6998 10.75 6.7442a7.5598 7.5598 0 0 0 1.7383 0.20312h237.39a7.5598 7.5598 0 0 0 1.7383-0.20312c4.4186-1.0444 7.9939-3.8074 10.75-6.7442 2.7561-2.9367 5.2771-6.288 9.0938-10.691 7.6333-8.8069 20.345-21.949 46.766-41.064 46.247-33.46 62.161-69.107 63.322-71.809a7.5598 7.5598 0 0 0 0.23242-0.51367 7.5598 7.5598 0 0 0 0.084-0.21484 7.5598 7.5598 0 0 0 0.14649-0.43946 7.5598 7.5598 0 0 0 0.0644-0.22265 7.5598 7.5598 0 0 0 0.0469-0.18164 7.5598 7.5598 0 0 0 0.01-0.041 7.5598 7.5598 0 0 0 2e-3 -8e-3 7.5598 7.5598 0 0 0 0.0899-0.44531 7.5598 7.5598 0 0 0 0.0312-0.18555 7.5598 7.5598 0 0 0 6e-3 -0.043 7.5598 7.5598 0 0 0 0-2e-3 7.5598 7.5598 0 0 0 0.0508-0.45703 7.5598 7.5598 0 0 0 0.0234-0.69336 7.5598 7.5598 0 0 0-0.0195-0.4629 7.5598 7.5598 0 0 0-0.0215-0.23046 7.5598 7.5598 0 0 0-3.9277-5.8711s-21.426-11.806-36.059-16.195a7.5598 7.5598 0 0 0-0.10937-0.0312c-10.75-3.0485-26.413-5.1744-35.533-6.248 3.7483-47.533 18.698-121.4 71.6-179.78a7.5598 7.5598 0 0 0-5.6016-12.635h-50.579c-10.45-9.3638-58.858-51.128-121.32-79.291l12.232-68.41a7.5598 7.5598 0 0 0-7.4414-8.8887zm9.0293 15.117h130.7l-11.674 65.299a7.5598 7.5598 0 0 0 4.4434 8.2715c48.34 20.874 88.566 50.904 109.36 67.902h-334.96c20.795-16.998 61.021-47.028 109.36-67.902a7.5598 7.5598 0 0 0 4.4453-8.2715zm-159.87 156.59h450.45c-60.453 75.866-66.453 169.27-66.016 208.22 3e-3 0.33931 6e-3 0.67075 0.01 1.002 0.0226 1.582 0.0537 3.1004 0.0937 4.4863 0.0625 2.2962 0.13749 4.3904 0.22265 6.1191-85.593 15.741-158.89 13.272-159.2 13.262-6.2e-4 -2e-5 -0.0527-2e-3 -0.0527-2e-3a7.5598 7.5598 0 0 0-4e-3 0 7.5598 7.5598 0 0 0-0.23437-6e-3 7.5598 7.5598 0 0 0-0.31641 6e-3 7.5598 7.5598 0 0 0-4e-3 0s-0.0388-2e-5 -0.0391 0c-0.23671 8e-3 -73.594 2.4848-159.23-13.264 0.0756-1.5351 0.14601-3.3181 0.20508-5.3027 1.095-34.132-1.8325-134.15-65.879-214.52zm50.578 192.53c0.40376 11.386 0.32602 18.853 0.05469 24.408-13.594-2.8114-27.341-6.0614-41.09-9.8926-1.2749-0.35618-2.55-0.71627-3.8242-1.082-1.2725-0.36484-2.5442-0.72626-3.8164-1.1016 5.8722-2.739 12.033-5.4532 16.477-6.791 9.4469-2.6691 23.728-4.5234 32.199-5.541zm349.27 0c8.4739 1.018 22.766 2.8727 32.211 5.543 4.4428 1.3387 10.596 4.0505 16.463 6.7871-1.6972 0.50068-3.3941 0.98658-5.0918 1.4688-0.55724 0.15849-1.1145 0.316-1.6719 0.47266-14.04 3.9386-28.082 7.2656-41.965 10.137-0.0505-1.0329-0.0859-2.2108-0.1211-3.3887-0.0298-1.1214-0.0521-2.3224-0.0703-3.5859-0.011-0.8389-0.0269-1.6331-0.0293-2.5469-2e-3 -0.34827 1e-3 -0.73467 0-1.0918 5e-3 -3.8669 0.0827-8.3599 0.27539-13.795zm52.973 26.834c-8.4363 12.682-23.575 31.273-49.42 49.973-27.233 19.703-41.103 33.924-49.326 43.412-4.1118 4.744-6.8407 8.2739-8.6934 10.248-1.501 1.5994-2.0614 1.9536-2.7227 2.1758h-234.88c-0.66124-0.22217-1.2216-0.57637-2.7227-2.1758-1.8527-1.9741-4.5816-5.5041-8.6934-10.248-8.2236-9.4879-22.093-23.709-49.326-43.412-25.84-18.695-40.977-37.283-49.414-49.965 11.846 3.4948 23.694 6.5526 35.449 9.2559 0.66523 0.15346 1.3316 0.30983 1.9961 0.46094 1.6403 0.37181 3.2762 0.73596 4.9121 1.0938 1.4701 0.32254 2.9368 0.63798 4.4023 0.94922 1.202 0.25452 2.4045 0.5106 3.6035 0.75781 2.6731 0.5526 5.3384 1.0894 7.9922 1.6055 0.02146 4e-3 0.043 0.01 0.06445 0.0137a7.5598 7.5598 0 0 0 0.19726 0.041c0.05294 0.0103 0.10527 0.019 0.1582 0.0293 0.0059 1e-3 0.01171 3e-3 0.01758 4e-3 2.7551 0.53321 5.4997 1.0489 8.2305 1.5449 86.521 15.737 159.8 13.1 160.57 13.072 0.77117 0.0282 74.032 2.6646 160.54-13.066 2.7478-0.49967 5.5087-1.0173 8.2812-1.5547 0.0529-0.0102 0.10526-0.019 0.15821-0.0293a7.5598 7.5598 0 0 0 0.22656-0.0469 7.5598 7.5598 0 0 0 0.0117-2e-3c2.7478-0.53424 5.5088-1.0926 8.2773-1.666 0.94773-0.19581 1.8981-0.39922 2.8477-0.59961 1.7775-0.37604 3.5575-0.75968 5.3418-1.1523 1.3363-0.29329 2.6725-0.58797 4.0117-0.89063 1.2536-0.28404 2.5095-0.57864 3.7656-0.87109 6.2245-1.4454 12.472-2.9975 18.734-4.6582 0.33086-0.0879 0.66128-0.17521 0.99219-0.26367 2.2734-0.60712 4.547-1.2262 6.8223-1.8633 0.22526-0.0631 0.45051-0.12801 0.67578-0.1914 2.3056-0.64865 4.6102-1.3001 6.916-1.9805z"/>
                                </g>
                            </svg>`;
                    break;

                case TABLEWARE.THERMOS:
                    result += `<svg viewBox="0 0 512 512" class="tableware-icon thermos">
                                <path d="m210 0c-39.097 0-70.809 31.711-70.809 70.809v51.609a7.5591 7.5591 0 0 0 0 0.082v318.69c0 39.097 31.711 70.809 70.809 70.809h91.996c39.097 0 70.809-31.711 70.809-70.809v-7.6211l61.59-61.59a7.5598 7.5598 0 0 0 2.2129-5.3457v-145.5a7.5598 7.5598 0 0 0-2.2129-5.3457l-61.59-61.59v-31.617a7.5591 7.5591 0 0 0 0-0.082v-51.691c0-39.097-31.711-70.809-70.809-70.809zm0 15.117h91.996c30.984 0 55.691 24.708 55.691 55.691v44.133h-203.38v-44.133c0-30.984 24.708-55.691 55.691-55.691zm-55.691 114.94h203.38v27.115a7.5591 7.5591 0 0 0 0 0.23242v42.619a7.5591 7.5591 0 0 0 0 0.30859v187.09a7.5591 7.5591 0 0 0 0 0.23243v42.619a7.5591 7.5591 0 0 0 0 0.30859v10.604c0 30.984-24.708 55.691-55.691 55.691h-91.996c-30.984 0-55.691-24.708-55.691-55.691zm218.5 45.521 48.686 48.686v139.24l-48.686 48.684v-21.471l29.688-29.688a7.5598 7.5598 0 0 0 2.2148-5.3457v-123.6a7.5598 7.5598 0 0 0-2.2148-5.3457l-29.688-29.689zm0 42.854 16.783 16.783v117.34l-16.783 16.783z"/>
                            </svg>`;
                    break;

                default:
                    break;
            }
            result += '</div>';
        })

        result += '</div>';
        result += '</div>';
        return result;
    }

    getItemCostInfo(cost) {
        if (!cost) {
            return '<div class="tea-param"><b>' + KEYS_MAP.COST + '</b>: ---</div>';
        }

        let result = '';
        result += '<div class="tea-param">';
        result += '<div class="tea-cost-container">';
        result += "<b>" + KEYS_MAP.COST + "</b>: ";
        result += cost + " BYN";
        result += '</div>';
        result += '</div>';
        return result;
    }

    getItemTagsInfo(tags) {
        if (!tags) {
            return '<div class="tea-param"><b>' + KEYS_MAP.TAGS + '</b>: ---</div>';
        }

        let tagsArray = tags.split(",").map(elem => elem.trim());
        let result = '';
        result += '<div class="tea-param">';
        result += "<b>" + KEYS_MAP.TAGS + "</b>: ";
        result += '<div class="tea-tags-container">';
        tagsArray.forEach((tag) => {
            result += '<div class="tea-tag selected">';
            result += tag;
            result += '</div>';
        })
        result += '</div>';
        result += '</div>';
        return result;
    }

    getItemReviewInfo(review) {
        if (!review) {
            return '<div class="tea-param"><b>' + KEYS_MAP.REVIEW + '</b>: ---</div>';
        }

        let result = '';
        result += '<div class="tea-param">';
        result += '<div class="tea-review-container">';
        result += "<b>" + KEYS_MAP.REVIEW + "</b>: ";
        result += review;
        result += '</div>';
        result += '</div>';
        return result;
    }

    getCardCategoryIcon(category) {
        let result = '';
        result += '<div class="tea-category-icon-container tea-category-' + CATEGORIES_CLASSNAMES_MAP[category] + '">';
        result += `<span class="tea-category-icon icon-leaf"></span>`;
        result += '</div>';
        return result;
    }

    addEventListeners() {
        let categoryCards = container.querySelectorAll(`#${ELEMENT_ID.CATEGORIES} > div`);
        categoryCards.forEach((categoryCard) => {
            categoryCard.addEventListener("click", this.handleChangeCategory(categoryCard));
        })

        let searchInput = document.getElementById(ELEMENT_ID.SEARCH_INPUT);
        if (searchInput) {
            searchInput.addEventListener("input", this.handleChangeSearchValue);
        }
        let searchButton = document.getElementById(ELEMENT_ID.SEARCH_BUTTON);
        if (searchButton) {
            searchButton.addEventListener("click", this.handleChangeSearchFilter);
        }
        let searchClearButton = document.getElementById(ELEMENT_ID.SEARCH_CLEAR_BUTTON);
        if (searchClearButton) {
            searchClearButton.addEventListener("click", this.handleClearSearchFilter);
        }

        let tagsButtons = container.querySelectorAll(`#${ELEMENT_ID.TAGS} > div`);
        tagsButtons.forEach((tagButton) => {
            tagButton.addEventListener("click", this.handleSelectTag(tagButton));
        })

        let stockTypeButtons = container.querySelectorAll(`#${ELEMENT_ID.STOCK_TYPE} > div`);
        stockTypeButtons.forEach((stockTypeButton) => {
            stockTypeButton.addEventListener("click", this.handleChangeStockType(stockTypeButton));
        })

        let randomizeTogglerButton = document.getElementById(ELEMENT_ID.RANDOMIZER_TOGGLER);
        if (randomizeTogglerButton) {
            randomizeTogglerButton.addEventListener("click", this.handleToggleRandomizer);
        }
        let randomizeSubmitButton = document.getElementById(ELEMENT_ID.RANDOMIZER_SUBMIT);
        if (randomizeSubmitButton) {
            randomizeSubmitButton.addEventListener("click", this.handleSubmitRandomizer);
        }

        let statisticsTogglerButton = document.getElementById(ELEMENT_ID.STATISTICS_TOGGLER);
        statisticsTogglerButton.addEventListener("click", this.handleToggleStatistics);
    }

    handleChangeCategory(categoryCard) {
        return (e) => {
            let category = categoryCard.getAttribute('data-category');

            if (this.isRandomizerEnabled) {
                if (!this.randomizerCategories.includes(category)) {
                    this.randomizerCategories.push(category);
                } else {
                    this.randomizerCategories = this.randomizerCategories.filter((elem) => elem !== category);
                }
            } else {
                if (category !== this.categoryFilter) {
                    this.categoryFilter = category;
                } else {
                    this.categoryFilter = null;
                }
            }

            this.renderContent();
        }
    }

    handleChangeSearchValue(e) {
        this.searchInputValue = e.target.value;
    }

    handleChangeSearchFilter() {
        this.searchFilter = this.searchInputValue;
        this.renderContent();
    }

    handleClearSearchFilter() {
        this.searchFilter = this.searchInputValue = "";
        this.renderContent();
    }

    handleSelectTag(tagButton) {
        return (e) => {
            let tag = tagButton.getAttribute('data-tag');

            if (this.isRandomizerEnabled) {
                if (!this.randomizerTags.includes(tag)) {
                    this.randomizerTags.push(tag);
                } else {
                    this.randomizerTags = this.randomizerTags.filter((elem) => elem !== tag);
                }
            } else {
                if (!this.tagsFilterArray.includes(tag)) {
                    this.tagsFilterArray.push(tag);
                } else {
                    this.tagsFilterArray = this.tagsFilterArray.filter((elem) => elem !== tag);
                }
            }

            this.renderContent();
        }
    }

    handleChangeStockType(stockTypeButton) {
        return (e) => {
            let stockType = stockTypeButton.getAttribute('data-stock-type');
            this.stockType = stockType;
            this.renderContent();
        }
    }

    handleToggleRandomizer() {
        if (this.isRandomizerEnabled) {
            this.randomTeaInfo = null;
            this.randomizerCategories = [];
            this.randomizerTags = [];
        } else {
            if (this.categoryFilter) {
                this.randomizerCategories = [this.categoryFilter];
            }
            if (this.tagsFilterArray && this.tagsFilterArray.length > 0) {
                this.randomizerTags = this.tagsFilterArray;
            }
            this.randomTeaInfo = this.getRandomTea();
        }
        this.isRandomizerEnabled = !this.isRandomizerEnabled;
        this.renderContent();
    }

    handleSubmitRandomizer() {
        this.randomTeaInfo = this.getRandomTea();
        this.renderContent();
    }

    getRandomTea() {
        let categories = this.randomizerCategories.length > 0 ? this.randomizerCategories : this.categoriesData;
        let data = {};
        Object.values(categories).map((category) => {
            let teaFiltered = this.data[category].teaList.filter((elem) => {
                let teaTags = elem[KEYS_MAP.TAGS].split(",").map(elem => elem.trim());
                let tagsDiff = this.randomizerTags.filter(tag => !teaTags.includes(tag));
                return tagsDiff.length === 0;
            });

            if (this.stockType !== STOCK_TYPE.ALL) {
                teaFiltered = teaFiltered.filter((elem) => {
                    if (this.stockType === STOCK_TYPE.IN_STOCK) {
                        return JSON.parse(elem[KEYS_MAP.IN_STOCK].toLowerCase());
                    } else {
                        return !JSON.parse(elem[KEYS_MAP.IN_STOCK].toLowerCase());
                    }
                });
            }

            if (teaFiltered && teaFiltered.length > 0) {
                data[category] = teaFiltered;
            }
        });
        let categoriesFiltered = Object.keys(data);
        let category = categoriesFiltered[Math.floor(Math.random() * categoriesFiltered.length)];
        let teaArray = data[category];
        let tea = teaArray ? teaArray[Math.floor(Math.random() * teaArray.length)] : null;
        let teaName = tea ? tea[KEYS_MAP.NAME] : null;

        let teaInfo = {
            category: category,
            name: teaName,
        }
        return teaInfo
    }

    handleToggleStatistics() {
        this.isStatisticsEnabled = !this.isStatisticsEnabled;
        this.renderContent();
    }

    renderCharts() {
        if (this.isStatisticsEnabled) {
            let stockPieChartOptions = {
                title: {
                    text: "Все чаи",
                    align: 'center',
                    style: {
                        fontWeight: '500',
                    },
                },
                colors: ["#009245", "#cccccc"],
                series: [
                    this.categoriesData.reduce((sum, category) => sum + this.data[category].inStockAmount, 0),
                    this.categoriesData.reduce((sum, category) => sum + this.data[category].outOfStockAmount, 0)
                ],
                chart: {
                    width: "100%",
                    type: 'pie',
                },
                labels: ["В наличии", "Не в наличии"],
                responsive: [{
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            };
            let stockPieChart = new ApexCharts(document.querySelector("#pie-chart-stock"), stockPieChartOptions);
            stockPieChart.render();

            let allPieChartOptions = {
                title: {
                    text: "Все чаи",
                    align: 'center',
                    style: {
                        fontWeight: '500',
                    },
                },
                colors: this.categoriesData.map((category) => CATEGORIES_COLOR[category]),
                series: this.categoriesData.map((category) => this.data[category].totalAmount),
                chart: {
                    width: "100%",
                    type: 'pie',
                },
                labels: this.categoriesData,
                responsive: [{
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            };
            let allPieChart = new ApexCharts(document.querySelector("#pie-chart-all"), allPieChartOptions);
            allPieChart.render();

            let allBarChartOptions = {
                title: {
                    text: "Все чаи",
                    align: 'center',
                    style: {
                        fontWeight: '500',
                    },
                },
                colors: this.categoriesData.map((category) => CATEGORIES_COLOR[category]),
                series: [{ data: this.categoriesData.map((category) => this.data[category].totalAmount) }],
                chart: {
                    width: "100%",
                    type: 'bar',
                    toolbar: {
                        show: false
                    }
                },
                labels: this.categoriesData,
                plotOptions: {
                    bar: {
                        distributed: true
                    }
                },
                legend: {
                    show: false
                }
            };
            let allBarChart = new ApexCharts(document.querySelector("#bar-chart-all"), allBarChartOptions);
            allBarChart.render();

            let inStockPieChartOptions = {
                title: {
                    text: "В наличии",
                    align: 'center',
                    style: {
                        fontWeight: '500',
                    },
                },
                colors: this.categoriesData.map((category) => CATEGORIES_COLOR[category]),
                series: this.categoriesData.map((category) => this.data[category].inStockAmount),
                chart: {
                    width: "100%",
                    type: 'pie',
                },
                labels: this.categoriesData,
                responsive: [{
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            };
            let inStockPieChart = new ApexCharts(document.querySelector("#pie-chart-in-stock"), inStockPieChartOptions);
            inStockPieChart.render();

            let inStockBarChartOptions = {
                title: {
                    text: "В наличии",
                    align: 'center',
                    style: {
                        fontWeight: '500',
                    },
                },
                colors: this.categoriesData.map((category) => CATEGORIES_COLOR[category]),
                series: [{ data: this.categoriesData.map((category) => this.data[category].inStockAmount) }],
                chart: {
                    width: "100%",
                    type: 'bar',
                    toolbar: {
                        show: false
                    }
                },
                labels: this.categoriesData,
                plotOptions: {
                    bar: {
                        distributed: true
                    }
                },
                legend: {
                    show: false
                }
            };
            let inStockBarChart = new ApexCharts(document.querySelector("#bar-chart-in-stock"), inStockBarChartOptions);
            inStockBarChart.render();

            let outOfStockPieChartOptions = {
                title: {
                    text: "Не в наличии",
                    align: 'center',
                    style: {
                        fontWeight: '500',
                    },
                },
                colors: this.categoriesData.map((category) => CATEGORIES_COLOR[category]),
                series: this.categoriesData.map((category) => this.data[category].outOfStockAmount),
                chart: {
                    width: "100%",
                    type: 'pie',
                },
                labels: this.categoriesData,
                responsive: [{
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            };
            let outOfStockPieChart = new ApexCharts(document.querySelector("#pie-chart-out-of-stock"), outOfStockPieChartOptions);
            outOfStockPieChart.render();

            let outOfStockBarChartOptions = {
                title: {
                    text: "Не в наличии",
                    align: 'center',
                    style: {
                        fontWeight: '500',
                    },
                },
                colors: this.categoriesData.map((category) => CATEGORIES_COLOR[category]),
                series: [{ data: this.categoriesData.map((category) => this.data[category].outOfStockAmount) }],
                chart: {
                    width: "100%",
                    type: 'bar',
                    toolbar: {
                        show: false
                    }
                },
                labels: this.categoriesData,
                plotOptions: {
                    bar: {
                        distributed: true
                    }
                },
                legend: {
                    show: false
                }
            };
            let outOfStockBarChart = new ApexCharts(document.querySelector("#bar-chart-out-of-stock"), outOfStockBarChartOptions);
            outOfStockBarChart.render();
        }
    }
}

const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQpTjrajTJBBVhh--4YMoEigqzpbGXiuz6zvIdgh6YAGnzkVhPyZ4piynKA8GuZ-dIvWqFNZRKvRLux/pub?gid=262473402&single=true&output=csv'

const teaGallery = new TeaGallery("container", publicSpreadsheetUrl);

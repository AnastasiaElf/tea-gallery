import {
    CATEGORIES_MAP,
    CATEGORIES_CLASSNAMES_MAP,
    CATEGORIES_COLOR,
    KEYS_MAP,
    TABLEWARE,
    TAGS,
    ELEMENT_ID,
    STOCK_TYPE,
} from "./constants.js";
import { ClayIcon, GlassIcon, PorcelainIcon, TeapotIcon, ThermosIcon } from "./icons.js";

class TeaGallery {
    // TODO: remove this or add clean details about all class fileds (how to do this better?)
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
            throw Error("Constructor param spreadsheetUrl is missing");
        }

        if (!containerId) {
            throw Error("Constructor param containerId is missing");
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
            complete: this.onGetDataFromSpreadsheet,
        });
    }

    onGetDataFromSpreadsheet(data) {
        this.data = {};

        let reducedData = data.data.reduce((result, value) => {
            let category = value[KEYS_MAP.CATEGORY];

            result[category] = result[category] || [];
            result[category].push(value);

            return result;
        }, {});

        Object.values(CATEGORIES_MAP).forEach((category) => {
            let teaList = reducedData[category] || [];
            this.data[category] = {
                name: category,
                teaList: teaList,
                totalAmount: teaList.length,
                inStockAmount: teaList.reduce(
                    (sum, tea) => (JSON.parse(tea[KEYS_MAP.IN_STOCK].toLowerCase()) ? ++sum : sum),
                    0
                ),
                outOfStockAmount: teaList.reduce(
                    (sum, tea) => (!JSON.parse(tea[KEYS_MAP.IN_STOCK].toLowerCase()) ? ++sum : sum),
                    0
                ),
            };
        });
        this.categoriesData = Object.values(CATEGORIES_MAP).sort();
        this.categoryFilter = null;
        this.searchFilter = "";
        this.searchInputValue = "";
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
        let result = "";

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
            let isSelected = this.isRandomizerEnabled
                ? this.randomizerCategories.includes(category)
                : this.categoryFilter === category;
            result += `
                <div 
                    class="tea-category-container tea-category-${CATEGORIES_CLASSNAMES_MAP[category]} ${
                isSelected ? "selected" : ""
            }"
                    data-category="${category}"
                >
                    <div class="tea-category-icon-container tea-category-${CATEGORIES_CLASSNAMES_MAP[category]} ${
                isSelected ? "selected" : ""
            }">
                        <span class="tea-category-icon icon-leaf"></span>
                    </div>
                    <div class="tea-category-name">
                        ${category}
                    </div>
                </div>
            `;
        });

        result += "</div>";
        return result;
    }

    renderSearch() {
        if (!this.isRandomizerEnabled) {
            let result = `<div class="tea-search-container">`;
            result += `<input id="${ELEMENT_ID.SEARCH_INPUT}" class="tea-input tea-search-input" type="text" placeholder="Найти..." value="${this.searchInputValue}"></input>`;
            result += '<div class="tea-search-buttons-container">';
            result += `<button id="${ELEMENT_ID.SEARCH_BUTTON}" class="tea-button tea-search-button tea-button-margin-right">Найти</button>`;
            result += `<button id="${ELEMENT_ID.SEARCH_CLEAR_BUTTON}" class="tea-button tea-search-clear-button">Очистить</button>`;
            result += "</div>";
            result += "</div>";
            return result;
        } else {
            return "";
        }
    }

    renderStockType() {
        let result = `<div id="${ELEMENT_ID.STOCK_TYPE}" class="tea-stock-type-container">`;
        result += `<div class="tea-stock-type ${
            this.stockType === STOCK_TYPE.ALL ? "selected" : ""
        }" data-stock-type="${STOCK_TYPE.ALL}">Все</div>`;
        result += `<div class="tea-stock-type ${
            this.stockType === STOCK_TYPE.IN_STOCK ? "selected" : ""
        }" data-stock-type="${STOCK_TYPE.IN_STOCK}">В наличии</div>`;
        result += `<div class="tea-stock-type ${
            this.stockType === STOCK_TYPE.OUT_OF_STOCK ? "selected" : ""
        }" data-stock-type="${STOCK_TYPE.OUT_OF_STOCK}">Не в наличии</div>`;
        result += "</div>";
        return result;
    }

    renderTags() {
        let result = `<div id="${ELEMENT_ID.TAGS}" class="tea-tags-container">`;
        this.tagsData.forEach((tag) => {
            let isSelected = this.isRandomizerEnabled
                ? this.randomizerTags.includes(tag)
                : this.tagsFilterArray.includes(tag);
            result += `
                <div 
                    class="tea-tag ${isSelected ? "selected" : ""}"
                    data-tag="${tag}"
                >
                    ${tag}
                </div>
            `;
        });
        result += "</div>";
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
        result += "</div>";
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
            result += "</div>";
            return result;
        } else {
            return "";
        }
    }

    renderStatisticsInfo() {
        if (this.isStatisticsEnabled) {
            let result = '<div class="tea-statistics-info-container">';
            result += '<div id="pie-chart-stock" class="chart-container"></div>';
            result += "</div>";
            result += '<div class="tea-statistics-info-container">';
            result += '<div id="pie-chart-all" class="chart-container"></div>';
            result += '<div id="bar-chart-all" class="chart-container"></div>';
            result += '<div id="pie-chart-in-stock" class="chart-container"></div>';
            result += '<div id="bar-chart-in-stock" class="chart-container"></div>';
            result += '<div id="pie-chart-out-of-stock" class="chart-container"></div>';
            result += '<div id="bar-chart-out-of-stock" class="chart-container"></div>';
            result += "</div>";
            return result;
        } else {
            return "";
        }
    }

    renderCards() {
        let result = "";

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
            result += "</div>";
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
                        let teaTags = elem[KEYS_MAP.TAGS].split(",").map((elem) => elem.trim());
                        let tagsDiff = this.tagsFilterArray.filter((tag) => !teaTags.includes(tag));
                        return tagsDiff.length === 0;
                    });
                }
                teaArray = teaArray
                    .filter(
                        (elem) =>
                            !this.searchFilter ||
                            elem[KEYS_MAP.NAME].toLowerCase().includes(this.searchFilter.toLowerCase())
                    )
                    .sort((a, b) => (a[KEYS_MAP.NAME] > b[KEYS_MAP.NAME] ? 1 : -1));
            }

            if (this.isRandomizerEnabled && teaArray.length < 1) {
                result += '<div class="table-container">';
                result += '<div class="table-divider"></div>';
                result += this.getNotFoundMessage();
                result += "</div>";
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
            result += "</h5>";

            if (categories.length === 1 && teaArray.length < 1) {
                result += this.getNotFoundMessage();
                result += "</div>";
                return result;
            }

            result += '<div class="table-data">';

            teaArray.forEach((teaData) => {
                result += `<div class="tea-card tea-category-${CATEGORIES_CLASSNAMES_MAP[category]} ${
                    JSON.parse(teaData[KEYS_MAP.IN_STOCK].toLowerCase()) ? "" : "out-of-stock"
                }">`;
                result += this.getItemRatingInfo(teaData[KEYS_MAP.RATING]);
                result += this.getItemNameInfo(teaData[KEYS_MAP.NAME]);
                result += this.getItemBrewingTimeInfo(teaData[KEYS_MAP.BREWING_TIME]);
                result += this.getItemTemperatureInfo(teaData[KEYS_MAP.TEMPERATURE]);
                result += this.getItemTablewareInfo(teaData[KEYS_MAP.TABLEWARE]);
                result += this.getItemCostInfo(teaData[KEYS_MAP.COST]);
                result += this.getItemTagsInfo(teaData[KEYS_MAP.TAGS]);
                result += this.getItemReviewInfo(teaData[KEYS_MAP.REVIEW]);
                result += this.getCardCategoryIcon(category);
                result += "</div>";
            });
            result += "</div>";
            result += "</div>";
        });

        return result;
    }

    getNotFoundMessage() {
        let result = "";
        result += '<div class="table-no-tea-message">';
        result += "По вашему запросу ничего не найдено";
        result += "</div>";
        return result;
    }

    getItemRatingInfo(rating) {
        if (!rating) {
            return "";
        }

        let result = "";
        result += '<div class="tea-rating-container">';

        for (let i = 0; i < 5; i++) {
            result += `<span class="icon-star rating-icon ${parseInt(rating) > i ? "filled" : ""}"></span>`;
        }

        result += "</div>";
        return result;
    }

    getItemNameInfo(name) {
        return `<h6 class="tea-name">${name}</h6>`;
    }

    getItemBrewingTimeInfo(time) {
        if (!time) {
            return '<div class="tea-param"><b>' + KEYS_MAP.BREWING_TIME + "</b>: ---</div>";
        }

        let timeArray = time.split("-").map((elem) => parseInt(elem));
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
        result += `<div class="time-bar-overlap" style="width: ${
            maxTime ? (maxTime < 60 ? maxTime : 100) : minTime ? (minTime < 60 ? minTime : 100) : 0
        }%;"></div>`;
        result += "</div>";
        result += '<div class="time-value">';
        result +=
            timeFrom.value +
            (timeTo
                ? (timeFrom.unit !== timeTo.unit ? timeFrom.unit : "") + "-" + timeTo.value + timeTo.unit
                : timeFrom.unit);
        result += "</div>";
        result += "</div>";
        result += "</div>";
        return result;
    }

    getItemTemperatureInfo(temperature) {
        if (!temperature || temperature > 100) {
            return '<div class="tea-param"><b>' + KEYS_MAP.TEMPERATURE + "</b>: ---</div>";
        }

        let temperatureArray = temperature
            .split("-")
            .map((elem) => parseInt(elem))
            .sort((a, b) => b - a);

        let result = "";
        result += '<div class="tea-param">';
        result += "<b>" + KEYS_MAP.TEMPERATURE + "</b>: ";
        result += '<div class="tea-temperature-container">';
        result += '<div class="temperature-bar">';
        result += `<div class="temperature-bar-overlap" style="width: ${temperatureArray[0]}%;"></div>`;
        result += "</div>";
        result += '<div class="temperature-value">';
        result += temperature + "°C";
        result += "</div>";
        result += "</div>";
        result += "</div>";
        return result;
    }

    getItemTablewareInfo(tableware) {
        if (!tableware) {
            return '<div class="tea-param"><b>' + KEYS_MAP.TABLEWARE + "</b>: ---</div>";
        }

        let result = "";
        result += '<div class="tea-param">';
        result += "<b>" + KEYS_MAP.TABLEWARE + "</b>: ";
        result += '<div class="tea-tableware-container">';

        let tablewareArray = tableware
            .split(",")
            .map((elem) => elem.trim())
            .sort();

        tablewareArray.forEach((elem) => {
            result += '<div class="tea-tableware-icon-container">';
            switch (elem) {
                case TABLEWARE.CLAY:
                    result += ClayIcon;
                    break;

                case TABLEWARE.PORCELAIN:
                    result += PorcelainIcon;
                    break;

                case TABLEWARE.TEAPOT:
                    result += TeapotIcon;
                    break;

                case TABLEWARE.GLASS:
                    result += GlassIcon;
                    break;

                case TABLEWARE.THERMOS:
                    result += ThermosIcon;
                    break;

                default:
                    break;
            }
            result += "</div>";
        });

        result += "</div>";
        result += "</div>";
        return result;
    }

    getItemCostInfo(cost) {
        if (!cost) {
            return '<div class="tea-param"><b>' + KEYS_MAP.COST + "</b>: ---</div>";
        }

        let result = "";
        result += '<div class="tea-param">';
        result += '<div class="tea-cost-container">';
        result += "<b>" + KEYS_MAP.COST + "</b>: ";
        result += cost + " BYN";
        result += "</div>";
        result += "</div>";
        return result;
    }

    getItemTagsInfo(tags) {
        if (!tags) {
            return '<div class="tea-param"><b>' + KEYS_MAP.TAGS + "</b>: ---</div>";
        }

        let tagsArray = tags.split(",").map((elem) => elem.trim());
        let result = "";
        result += '<div class="tea-param">';
        result += "<b>" + KEYS_MAP.TAGS + "</b>: ";
        result += '<div class="tea-tags-container">';
        tagsArray.forEach((tag) => {
            result += '<div class="tea-tag selected">';
            result += tag;
            result += "</div>";
        });
        result += "</div>";
        result += "</div>";
        return result;
    }

    getItemReviewInfo(review) {
        if (!review) {
            return '<div class="tea-param"><b>' + KEYS_MAP.REVIEW + "</b>: ---</div>";
        }

        let result = "";
        result += '<div class="tea-param">';
        result += '<div class="tea-review-container">';
        result += "<b>" + KEYS_MAP.REVIEW + "</b>: ";
        result += review;
        result += "</div>";
        result += "</div>";
        return result;
    }

    getCardCategoryIcon(category) {
        let result = "";
        result += '<div class="tea-category-icon-container tea-category-' + CATEGORIES_CLASSNAMES_MAP[category] + '">';
        result += `<span class="tea-category-icon icon-leaf"></span>`;
        result += "</div>";
        return result;
    }

    addEventListeners() {
        let categoryCards = container.querySelectorAll(`#${ELEMENT_ID.CATEGORIES} > div`);
        categoryCards.forEach((categoryCard) => {
            categoryCard.addEventListener("click", this.handleChangeCategory(categoryCard));
        });

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
        });

        let stockTypeButtons = container.querySelectorAll(`#${ELEMENT_ID.STOCK_TYPE} > div`);
        stockTypeButtons.forEach((stockTypeButton) => {
            stockTypeButton.addEventListener("click", this.handleChangeStockType(stockTypeButton));
        });

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
            let category = categoryCard.getAttribute("data-category");

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
        };
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
            let tag = tagButton.getAttribute("data-tag");

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
        };
    }

    handleChangeStockType(stockTypeButton) {
        return (e) => {
            let stockType = stockTypeButton.getAttribute("data-stock-type");
            this.stockType = stockType;
            this.renderContent();
        };
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
                let teaTags = elem[KEYS_MAP.TAGS].split(",").map((elem) => elem.trim());
                let tagsDiff = this.randomizerTags.filter((tag) => !teaTags.includes(tag));
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
        };
        return teaInfo;
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
                    align: "center",
                    style: {
                        fontWeight: "500",
                    },
                },
                colors: ["#009245", "#cccccc"],
                series: [
                    this.categoriesData.reduce((sum, category) => sum + this.data[category].inStockAmount, 0),
                    this.categoriesData.reduce((sum, category) => sum + this.data[category].outOfStockAmount, 0),
                ],
                chart: {
                    width: "100%",
                    type: "pie",
                },
                labels: ["В наличии", "Не в наличии"],
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            legend: {
                                position: "bottom",
                            },
                        },
                    },
                ],
            };
            let stockPieChart = new ApexCharts(document.querySelector("#pie-chart-stock"), stockPieChartOptions);
            stockPieChart.render();

            let allPieChartOptions = {
                title: {
                    text: "Все чаи",
                    align: "center",
                    style: {
                        fontWeight: "500",
                    },
                },
                colors: this.categoriesData.map((category) => CATEGORIES_COLOR[category]),
                series: this.categoriesData.map((category) => this.data[category].totalAmount),
                chart: {
                    width: "100%",
                    type: "pie",
                },
                labels: this.categoriesData,
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            legend: {
                                position: "bottom",
                            },
                        },
                    },
                ],
            };
            let allPieChart = new ApexCharts(document.querySelector("#pie-chart-all"), allPieChartOptions);
            allPieChart.render();

            let allBarChartOptions = {
                title: {
                    text: "Все чаи",
                    align: "center",
                    style: {
                        fontWeight: "500",
                    },
                },
                colors: this.categoriesData.map((category) => CATEGORIES_COLOR[category]),
                series: [{ data: this.categoriesData.map((category) => this.data[category].totalAmount) }],
                chart: {
                    width: "100%",
                    type: "bar",
                    toolbar: {
                        show: false,
                    },
                },
                labels: this.categoriesData,
                plotOptions: {
                    bar: {
                        distributed: true,
                    },
                },
                legend: {
                    show: false,
                },
            };
            let allBarChart = new ApexCharts(document.querySelector("#bar-chart-all"), allBarChartOptions);
            allBarChart.render();

            let inStockPieChartOptions = {
                title: {
                    text: "В наличии",
                    align: "center",
                    style: {
                        fontWeight: "500",
                    },
                },
                colors: this.categoriesData.map((category) => CATEGORIES_COLOR[category]),
                series: this.categoriesData.map((category) => this.data[category].inStockAmount),
                chart: {
                    width: "100%",
                    type: "pie",
                },
                labels: this.categoriesData,
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            legend: {
                                position: "bottom",
                            },
                        },
                    },
                ],
            };
            let inStockPieChart = new ApexCharts(document.querySelector("#pie-chart-in-stock"), inStockPieChartOptions);
            inStockPieChart.render();

            let inStockBarChartOptions = {
                title: {
                    text: "В наличии",
                    align: "center",
                    style: {
                        fontWeight: "500",
                    },
                },
                colors: this.categoriesData.map((category) => CATEGORIES_COLOR[category]),
                series: [{ data: this.categoriesData.map((category) => this.data[category].inStockAmount) }],
                chart: {
                    width: "100%",
                    type: "bar",
                    toolbar: {
                        show: false,
                    },
                },
                labels: this.categoriesData,
                plotOptions: {
                    bar: {
                        distributed: true,
                    },
                },
                legend: {
                    show: false,
                },
            };
            let inStockBarChart = new ApexCharts(document.querySelector("#bar-chart-in-stock"), inStockBarChartOptions);
            inStockBarChart.render();

            let outOfStockPieChartOptions = {
                title: {
                    text: "Не в наличии",
                    align: "center",
                    style: {
                        fontWeight: "500",
                    },
                },
                colors: this.categoriesData.map((category) => CATEGORIES_COLOR[category]),
                series: this.categoriesData.map((category) => this.data[category].outOfStockAmount),
                chart: {
                    width: "100%",
                    type: "pie",
                },
                labels: this.categoriesData,
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            legend: {
                                position: "bottom",
                            },
                        },
                    },
                ],
            };
            let outOfStockPieChart = new ApexCharts(
                document.querySelector("#pie-chart-out-of-stock"),
                outOfStockPieChartOptions
            );
            outOfStockPieChart.render();

            let outOfStockBarChartOptions = {
                title: {
                    text: "Не в наличии",
                    align: "center",
                    style: {
                        fontWeight: "500",
                    },
                },
                colors: this.categoriesData.map((category) => CATEGORIES_COLOR[category]),
                series: [{ data: this.categoriesData.map((category) => this.data[category].outOfStockAmount) }],
                chart: {
                    width: "100%",
                    type: "bar",
                    toolbar: {
                        show: false,
                    },
                },
                labels: this.categoriesData,
                plotOptions: {
                    bar: {
                        distributed: true,
                    },
                },
                legend: {
                    show: false,
                },
            };
            let outOfStockBarChart = new ApexCharts(
                document.querySelector("#bar-chart-out-of-stock"),
                outOfStockBarChartOptions
            );
            outOfStockBarChart.render();
        }
    }
}

const publicSpreadsheetUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQpTjrajTJBBVhh--4YMoEigqzpbGXiuz6zvIdgh6YAGnzkVhPyZ4piynKA8GuZ-dIvWqFNZRKvRLux/pub?gid=262473402&single=true&output=csv";

const teaGallery = new TeaGallery("container", publicSpreadsheetUrl);

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
}

const KEYS_MAP = {
    NAME: "Название",
    BREWING_TIME: "Время заваривания",
    TEMPERATURE: "Температура воды",
    TABLEWARE: "Посуда",
    RATING: "Оценка",
    REVIEW: "Отзыв",
    COST: "Цена за 50г",
    TAGS: "Теги",
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
        this.getData(spreadsheetUrl);
    }

    getData(spreadsheetUrl) {
        Tabletop.init({
            key: spreadsheetUrl,
            callback: this.onGetDataFromSpreadsheet
        })
    }

    onGetDataFromSpreadsheet(data) {
        this.data = {};
        Object.values(CATEGORIES_MAP).forEach((category) => {
            this.data[category] = data[category].all();
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

        this.renderContent();
    }

    renderContent() {
        let result = '';

        result += this.renderCategories();
        result += this.renderTags();
        result += this.renderRandomizerControls();
        result += this.renderSearch();
        result += this.renderCards();

        this.container.innerHTML = result;

        this.addEventListeners();
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
            result += `<button id="${ELEMENT_ID.SEARCH_BUTTON}" class="tea-button tea-search-button">Найти</button>`
            result += `<button id="${ELEMENT_ID.SEARCH_CLEAR_BUTTON}" class="tea-button tea-search-clear-button">Очистить</button>`
            result += '</div>';
            result += '</div>';
            return result;
        } else {
            return '';
        }
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
            result += `<button id="${ELEMENT_ID.RANDOMIZER_SUBMIT}" class="tea-button tea-search-clear-button">Подобрать чай</button>`;
            result += `<button id="${ELEMENT_ID.RANDOMIZER_TOGGLER}" class="tea-button tea-search-clear-button">Вернуться ко всем чаям</button>`;
        } else {
            result += `<button id="${ELEMENT_ID.RANDOMIZER_TOGGLER}" class="tea-button tea-search-button">Случайный чай</button>`;
        }
        result += '</div>';
        return result;
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
            let teaArray = this.data[category]
            if (this.isRandomizerEnabled) {
                teaArray = teaArray ? teaArray.filter((elem) => elem[KEYS_MAP.NAME] === this.randomTeaInfo.name) : [];
            } else {
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
            result += '</h5>';

            if (categories.length === 1 && teaArray.length < 1) {
                result += this.getNotFoundMessage();
                result += '</div>';
                return result;
            }

            result += '<div class="table-data">';

            teaArray.forEach(teaData => {
                result += `<div class="tea-card tea-category-${CATEGORIES_CLASSNAMES_MAP[category]}">`;
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

        tablewareArray.forEach((elem) => {
            result += '<div class="tea-tableware-icon-container">';
            switch (elem) {
                case TABLEWARE.CLAY:
                    result += `<svg viewBox="0 0 512 512" class="tableware-icon clay">
                                <path style="fill:#923639;" d="M238.368,134.757v-28.1c0-10.641,8.66-19.296,19.305-19.296h8.714 c10.639,0,19.295,8.656,19.295,19.296v28.1H238.368z"/>
                                <path style="fill:#A63E42;" d="M262.031,424.638c-44.348,0-86.99-12.182-120.071-34.302c-32.97-22.028-54.081-52.226-59.444-85.032 c-8.033-55.319-72.723-88.172-73.375-88.497l-2.539-1.267l35.734-34.582l0.949,0.113c0.682,0.081,16.91,2.083,34.598,9.363 c2.494,1.025,5.051,2.169,7.523,3.276c8.87,3.967,18.042,8.069,27.03,8.069c6.117,0,11.617-1.895,16.816-5.794 c0.474-0.387,0.961-0.782,1.456-1.177v-1.033l1.322-0.007c9.579-7.447,20.285-14.073,31.831-19.697l0.417-0.203h195.496l0.426,0.203 c12.605,6.14,24.164,13.444,34.358,21.709c31.185,25.242,48.359,58.162,48.359,92.695c0,12.509-2.252,24.898-6.692,36.823 c-10.445,28.097-33.219,53.404-64.125,71.26C340.303,414.928,302.242,424.638,262.031,424.638z"/>
                                <path style="fill:#923639;" d="M161.509,177.885l12.334-24.963c6.75-13.681,20.423-22.181,35.682-22.181h105.01 c15.26,0,28.932,8.499,35.682,22.182l12.322,24.962L161.509,177.885L161.509,177.885z"/>
                                <path d="M345.224,345.969c-23.278,13.829-52.823,21.446-83.195,21.446c-5.545,0-10.039,4.496-10.039,10.039 s4.495,10.039,10.039,10.039c33.927,0,67.115-8.617,93.45-24.264c4.767-2.831,6.335-8.991,3.503-13.758 C356.152,344.703,349.992,343.135,345.224,345.969z"/>
                                <path d="M472.152,166.021c-25.9-10.363-55.734-3.397-79.648,18.077c-7.935-5.779-16.534-11.028-25.679-15.68l-9.403-19.048 c-8.114-16.444-24.546-26.659-42.885-26.659h-20.821v-16.053c0-15.069-12.259-27.328-27.327-27.328h-8.714 c-15.074,0-27.337,12.259-27.337,27.328v16.053h-20.811c-18.34,0-34.772,10.215-42.882,26.654l-9.415,19.055 c-11.085,5.638-21.405,12.166-30.698,19.456c-0.036,0.028-0.072,0.057-0.107,0.086c-0.709,0.553-1.411,1.119-2.131,1.705 c-10.133,7.494-20.147,3.626-35.605-3.288c-2.528-1.13-5.142-2.3-7.747-3.371c-18.691-7.691-35.973-9.823-36.7-9.91 c-3-0.36-6.002,0.652-8.175,2.754L3.057,207.796c-2.341,2.266-3.436,5.527-2.939,8.746c0.497,3.22,2.526,5.998,5.441,7.452 c0.614,0.306,61.574,31.257,69.006,82.43c0.008,0.059,0.018,0.117,0.027,0.177c5.726,35.026,28.068,67.136,62.906,90.413 c34.386,22.994,78.614,35.657,124.534,35.657c41.619,0,81.07-10.082,114.086-29.157c31.607-18.259,55.18-44.072,66.664-72.902 c5.148-4.412,19.135-16.792,33.178-32.669c23.787-26.894,35.911-50.355,36.037-69.737 C512.173,199.75,496.905,175.924,472.152,166.021z M250.415,106.657c0-3.997,3.256-7.249,7.258-7.249h8.714 c3.997,0,7.248,3.252,7.248,7.249v16.053h-23.221V106.657z M184.647,158.253c4.706-9.539,14.24-15.464,24.879-15.464h30.85h43.299 h30.86c10.64,0,20.173,5.925,24.88,15.466l3.744,7.584h-162.26L184.647,158.253z M262.031,412.591 c-41.991,0-82.254-11.46-113.376-32.271c-30.135-20.135-49.393-47.434-54.235-76.875c-6.775-46.336-47.184-77.397-67.846-90.468 l19.844-19.206c5.737,1.057,16.129,3.379,26.883,7.804c2.324,0.956,4.686,2.012,7.187,3.13c15.124,6.765,35.839,16.031,55.992,0.917 c0.103-0.077,0.242-0.188,0.342-0.269c0.676-0.548,1.359-1.105,2.053-1.644c0.058-0.044,0.114-0.089,0.171-0.136 c8.457-6.62,17.898-12.546,28.073-17.659h189.816c10.995,5.525,21.098,11.976,30.04,19.227 c28.304,22.911,43.893,52.506,43.893,83.332c0,11.068-1.997,22.043-5.937,32.623C404.908,374.969,337.92,412.591,262.031,412.591z M450.688,295.686c0.155-2.398,0.26-4.801,0.26-7.21c0-33.656-15.087-65.767-42.721-91.46 c20.624-17.283,42.192-18.063,56.466-12.353c17.174,6.871,27.352,23.101,27.225,43.413 C491.787,248.476,470.043,275.818,450.688,295.686z"/>
                                <path d="M374.794,328.616c-12.919,0-12.941,20.078,0,20.078C387.713,348.695,387.735,328.616,374.794,328.616z"/>
                            </svg>`;

                    break;

                case TABLEWARE.PORCELAIN:
                    result += `<svg viewBox="0 0 512 512" class="tableware-icon porcelain">
                                <path style="fill:#D5D6DB;stroke:#000000;stroke-width:15;stroke-miterlimit:10;" d="M493.5,204.6c-11.2-45.6-31.7-57.4-61.4-58.9c-29.6-1.5-55.6,44.2-55.7,44.5C364.1,175,353.1,167,353.1,167v-12 c0-5.2-4.2-9.3-9.3-9.3h0c-8.3-10.2-31-18.3-60-21.4c0.5-2,0.8-4.2,0.8-6.4c0-15.1-12.2-27.3-27.3-27.3c-15.1,0-27.3,12.2-27.3,27.3 c0,2.2,0.3,4.3,0.8,6.4c-29,3.1-51.7,11.2-60,21.4h-2.5c-5.2,0-9.3,4.2-9.3,9.3v12c0,0-23.8,17.4-40.7,49.3 c-4.1,3.8-12.5,5.4-27.4-17C67.8,165,67,147.7,51.8,145.6c-10.8-1.5-26.6,3.1-34.9,5.9c-2.2,0.7-2.6,3.6-0.7,4.9 c6.3,4.6,17,15.3,21.1,36.8c6,30.6-1.2,116.5,70.3,133.3c15.2,55.2,60.2,98.5,142.4,94.6H262c68.5,3.2,111.1-26.2,132.3-68.1 C494.7,333,504.5,249,493.5,204.6z M407.1,315.1c2-10.3,3.1-21,3.3-31.8c0.2-14.5-1.9-27.8-5.4-39.8c-0.8-19.8,0.8-34.6,3.8-45.6 c8.1-29.1,48-33.2,61.6-6.3c17.8,35.2,0.3,74-15.9,98C445.1,303.8,425.1,311.2,407.1,315.1z"/>
                                <path style="fill:#E6E9EF;stroke:#000000;stroke-width:15;stroke-miterlimit:10;" d="M353.1,167v-12c0-5.2-4.2-9.3-9.3-9.3H168.2c-5.2,0-9.3,4.2-9.3,9.3v12c0,0-58.2,42.7-57.2,116.4 c1,73.7,45.6,142.6,148.4,137.7H262c102.8,4.8,147.4-64,148.4-137.7C411.3,209.7,353.1,167,353.1,167z"/>
                            </svg>`;
                    break;

                case TABLEWARE.GLASS:
                    result += `<svg viewBox="0 0 84.88 77.57" class="tableware-icon glass">
                                <g style="fill:#ddfffb">
                                    <path d="M63.79,24c1.36,0,2.61-.46,2.51-1.89s-1.65-1-2.61-1c-7.06,0-14.12,0-21.18,0h-9.7V24Z"/>
                                    <path d="M63,16.34c-1.12-2.32-2.87-2.21-4.26-2.65-4.7-1.47-5.47-2.28-5.58-7.29,0-1.85-.85-2.26-2.4-2.25-5.52,0-11,0-16.55,0a3,3,0,0,0-1.43.28V16.64C42.87,16.71,52.85,16.8,63,16.34Z"/>
                                    <path d="M42.7,46.81l23.72-.19c3,.06,4-1.3,4.74-4C73,36.09,73,29,77.23,23.23c.22-.3.25-1.15.06-1.28-1.5-1-3.24-.35-4.86-.61-1.21-.19-1.76.46-1.89,1.6-.35,3.22-2.41,4.6-5.39,4.61q-16.17.06-32.34,0V46.8Z"/>
                                    <path d="M55,67.33c1.59,0,3-.49,2.85-2.41-.18-3.41,1.73-5.22,4.56-6.53a9.61,9.61,0,0,0,5.09-4.83c.63-1.42.64-2.38-1.21-2.38-7.89,0-15.78,0-23.67,0-3.27.13-6.55.15-9.82.14v16Z"/>
                                    <path d="M80.24,51.55c-2-1.55-7.24-.24-8.18,2.22a15.08,15.08,0,0,1-7.82,8.51,4.16,4.16,0,0,0-2.77,4.14c0,3.37-1.77,5-5.12,5H32.81v2.17l9.21.09h15.1c1,0,1.91-.15,2.87-.11,2.33.09,3.85-.82,3.55-3.31-.5-4.2,1.47-6.73,5.07-8.44,1.93-.93,3.74-2.12,5.66-3.07a13,13,0,0,0,5.87-5.09C80.51,53.05,81.29,52.36,80.24,51.55Z"/>
                                </g>
                                <g style="fill:#ecfaff">
                                    <path d="M21.32,21.06c-1.12,0-2.69-.31-2.69,1.46C18.62,24,20,24,21.06,24H32.81V21C29,21,25.15,21,21.32,21.06Z"/>
                                    <path d="M32,6.86c.34,3.87-1.07,5.41-4.87,6.64-1.54.51-3.65.32-4.64,3.1,3.45,0,6.89,0,10.31,0V4.43C32.11,4.81,31.9,5.58,32,6.86Z"/>
                                    <path d="M15.28,24.86c-.53-4.21-3.38-3.34-6-3.53C7.4,21.19,7,22,8,23.36c4.21,6,4.47,13.31,6.59,20,.81,2.57,1.9,3.51,4.44,3.49,4.61,0,9.21,0,13.82,0V27.59h-13C17.8,27.58,15.52,26.78,15.28,24.86Z"/>
                                    <path d="M17.61,53.84a10.84,10.84,0,0,0,5.56,4.85c2.6,1.21,4.31,3,4.11,6.1-.12,1.92.86,2.55,2.59,2.55h2.94v-16c-4.5,0-9-.13-13.51-.2C16.84,51.07,16.62,51.87,17.61,53.84Z"/>
                                    <path d="M28.67,71.48c-3.35,0-5.3-1.79-5.3-5a4.68,4.68,0,0,0-3.07-4.69c-3-1.45-5.89-3.37-6.67-6.65-1-4.29-3.79-4.18-7.06-4-2.47.15-2.58,1.13-1.45,3,2,3.26,5.31,4.9,8.67,6.07C19,62,21.66,65.3,21.32,70.86c-.13,2,.72,2.73,2.74,2.7l8.75.08V71.47Z"/>
                                </g>
                                <path d="M42.34,77.56c-6.23,0-12.46,0-18.7,0-4.52,0-6.37-1.54-6.15-6,.2-3.86-1.09-5.88-4.76-7.1-4.32-1.44-8.33-3.69-11-7.6-1.54-2.24-2.43-4.72-1-7.41,1.34-2.45,3.6-3,6.15-2.73,2.9.31,3.72-.52,2.87-3.57C8,36.77,7.32,30.07,3.48,24.26c-1.95-3,.45-7,4.06-7.49a22.16,22.16,0,0,1,4.31-.08c2.53.14,4.56-.19,6-2.83S22,10.31,24.69,9.63c2-.51,3.1-1.08,2.77-3.61C27,2.28,29.06.17,32.93.09q9.34-.18,18.7,0c4.25.08,6,2,5.81,6.4-.09,1.83.47,2.66,2.16,3A12.41,12.41,0,0,1,68,15.18a3,3,0,0,0,3,1.51c1.44-.06,2.88,0,4.32,0,5.89.1,8.4,4.52,5.18,9.51C76.78,31.94,76.7,38.72,74.78,45c-.41,1.32.44,1.71,1.55,1.74s1.92,0,2.88,0c4.61.3,7,4.28,4.93,8.43a13.6,13.6,0,0,1-5.77,6.25,41.29,41.29,0,0,1-6.43,3.1c-3.53,1.14-4.81,3.17-4.52,6.92.33,4.27-1.73,6.06-6,6.08-6.35,0-12.7,0-19.06,0Zm24-30.94c3,.06,4-1.3,4.75-4C72.9,36.09,73,29,77.18,23.23c.22-.3.25-1.15.06-1.28-1.5-1-3.24-.35-4.87-.61-1.2-.19-1.75.46-1.88,1.6-.35,3.22-2.42,4.6-5.39,4.61q-22.65.07-45.3,0c-2.06,0-4.33-.8-4.57-2.72-.54-4.21-3.39-3.34-6-3.53-1.89-.14-2.29.66-1.33,2,4.2,6,4.47,13.31,6.58,20,.82,2.57,1.91,3.51,4.45,3.49,7.9-.07,15.81,0,23.71,0m-.08,4.36c-7.76.31-15.55.06-23.32-.06-2.46,0-2.68.76-1.69,2.73a10.84,10.84,0,0,0,5.56,4.85c2.59,1.21,4.31,3,4.11,6.1-.13,1.92.85,2.55,2.58,2.55,8.38,0,16.76,0,25.15,0,1.59,0,2.95-.49,2.84-2.41-.18-3.41,1.74-5.22,4.57-6.53a9.64,9.64,0,0,0,5.09-4.83c.62-1.42.64-2.38-1.21-2.38C58.36,51.16,50.46,51.17,42.57,51.17ZM63,16.34c-1.12-2.32-2.87-2.21-4.26-2.65-4.7-1.47-5.47-2.28-5.58-7.29,0-1.85-.85-2.26-2.41-2.25-5.51,0-11,0-16.54,0-1.87,0-2.4.78-2.23,2.71.34,3.87-1.08,5.41-4.87,6.64-1.54.51-3.65.32-4.64,3.1C36.06,16.58,49.33,17,63,16.34ZM42,73.73H57.06c1,0,1.92-.15,2.88-.11,2.33.09,3.84-.82,3.55-3.31-.5-4.2,1.47-6.73,5.06-8.44,1.94-.93,3.74-2.12,5.67-3.07a12.91,12.91,0,0,0,5.86-5.09c.37-.66,1.15-1.35.11-2.16-2-1.55-7.25-.24-8.19,2.22a15,15,0,0,1-7.81,8.51,4.17,4.17,0,0,0-2.78,4.14c0,3.37-1.77,5-5.12,5l-27.67,0c-3.36,0-5.31-1.79-5.3-5a4.68,4.68,0,0,0-3.07-4.69c-3-1.45-5.89-3.37-6.67-6.65-1-4.29-3.79-4.18-7.07-4-2.46.15-2.57,1.13-1.44,3,2,3.26,5.31,4.9,8.67,6.07C19,62,21.61,65.3,21.26,70.86c-.12,2,.73,2.73,2.75,2.7M42.45,21.05h0c-7.06,0-14.12,0-21.18,0-1.12,0-2.69-.31-2.7,1.46C18.57,24,19.93,24,21,24H63.73c1.37,0,2.62-.46,2.52-1.89s-1.65-1-2.62-1C56.57,21,49.51,21.05,42.45,21.05Z"/>
                            </svg>`;
                    break;

                case TABLEWARE.TEAPOT:
                    result += `<svg viewBox="0 0 78.4 95.9" class="tableware-icon teapot">
                                <g fill="#ddfffb">
                                    <path d="M59.2,32.3c0.1-2.6-0.9-3.5-3.2-3.6c-4.3,0-8.6,0-13,0v30.8c4.1,0,8.3-0.1,12.4,0c3.2,0.1,4.3-1.2,4-4.3 C59.4,47.6,59.4,45.5,59.2,32.3z"/>
                                    <path d="M54.9,9.7c0.7,0,1.5,0.2,1.9-0.7c0.3-0.8-0.3-1.3-0.8-1.8C52.5,4,47,4,43,5.9v3.7l5.5,0 C50.6,9.7,52.8,9.7,54.9,9.7z"/>
                                    <path d="M72.9,20.9c-2.3-3.9-6.3-5.3-10.4-6.1c-6.4-1.3-13-1.3-19.5-0.9v10.8h5.1c7.6,0,15.1,0,22.7,0	C73.8,24.6,74.4,23.4,72.9,20.9z"/>
                                    <path d="M71.6,87.7c-0.6-4.7-0.9-9.5-1-14.3c-0.3-13.7-0.4-27.3,0.6-40.9c0.3-3.3-1.1-3.8-3.5-3.6	c-2,0.1-4.5-0.6-4.3,3.3c0,8.8,0.3,17.7-0.1,26.6c-0.3,3.8-2.2,5.4-6,5.4c-4.8,0-9.5,0-14.3,0v27.2c1.9,0,3.7,0,5.6,0 c6.5,0,13-0.1,19.4,0.1C71,91.6,71.9,90.4,71.6,87.7z"/>
                                </g>
                                <g fill="#ecfaff">
                                    <path d="M23.2,95.7h4c-1.8-0.1-3.1-0.4-4-1.2V95.7z"/>
                                    <path d="M24.3,20.8c-0.6,0.8-1.6,1.7-1,2.9c0.7,1.3,2,1,3.2,1H43V13.9c-1.3,0.1-2.5,0.2-3.8,0.2 C33.6,14.5,27.9,15.4,24.3,20.8z"/>
                                    <path d="M33.6,56.7c0-8.4-0.1-16.8,0.1-25.2c0.1-3.5-2.3-2.5-4.2-2.7c-1.9-0.1-3.5,0-3.2,2.8c0.5,4,0.8,8.1,0.9,12.2 c0.2,14.5,0.6,29-1,43.5c-0.4,3.3,0.8,4.4,4.1,4.3c4.2-0.2,8.5-0.1,12.7-0.1V64.2c-0.6,0-1.3,0-1.9,0 C35.5,64.2,33.6,62.3,33.6,56.7z"/>
                                    <path d="M40.3,8.8c0.3,0.9,1.1,0.8,1.8,0.8l0.9,0V6c-0.6,0.3-1.2,0.7-1.8,1.1C40.5,7.4,40.1,8.1,40.3,8.8z"/>
                                    <path d="M38.2,31.6c0.1,4.2,0,8.4,0,12.6c0,4.1,0.1,8.1,0,12.2c0,2.3,0.9,3.3,3.2,3.3c0.5,0,1.1,0,1.6,0V28.8 c-0.7,0-1.4,0-2.1,0C38.9,28.8,38.1,29.5,38.2,31.6z"/>
                                </g>
                                <path d="M48.1,95.7H28.4c-5.4,0-6.9-1.4-6.8-6.9c0.1-4.5,0.5-9.1,0.9-13.6c0.3-2.6-0.5-3.5-3.1-4C6.5,69.3-2.8,54.6,0.8,42	c1.8-6.5,7.1-10,13.9-9.2c1.1,0.1,2.1,0.3,3.2,0.5c1.6,0.4,3,1.9,3.9,0.3s0.3-3.8-0.7-5.5c-2.8-4.6-2.6-7.4,0.9-11.4 c2.5-2.8,5.9-4.7,9.5-5.4c1.9-0.3,3.5-1.6,4.1-3.4c1.6-4.4,8-8.4,13.2-7.7S59.2,2,61.3,7.8c0.8,2.2,2.2,3.1,4.4,3.6 c5.6,1.4,10.1,4.3,12.2,10.1c0.6,1.7,0.8,3.4-0.4,4.8c-2,2.2-1.9,4.8-2,7.4c-1.1,18-1.1,36,0.2,53.9c0.4,7-0.8,7.7-7.9,8 M48.6,91.5c6.5,0,13-0.1,19.4,0.1c3,0.1,3.9-1.1,3.6-3.8c-0.6-4.7-0.9-9.5-1-14.3c-0.3-13.7-0.4-27.3,0.6-40.9	c0.3-3.3-1.1-3.8-3.5-3.6c-2,0.1-4.5-0.6-4.3,3.3c0,8.8,0.3,17.7-0.1,26.6c-0.3,3.8-2.2,5.4-6,5.4c-5.4,0-10.8,0-16.2,0 c-5.6,0-7.5-1.9-7.4-7.5c0-8.4-0.1-16.8,0.1-25.2c0.1-3.5-2.3-2.5-4.2-2.7s-3.5,0-3.2,2.8c0.5,4,0.8,8.1,0.9,12.2 c0.2,14.5,0.6,29-1,43.5c-0.4,3.3,0.8,4.4,4.1,4.3C36.3,91.3,42.4,91.5,48.6,91.5z M38.2,44.1L38.2,44.1c0,4.1,0.1,8.1,0,12.2 c0,2.3,0.9,3.3,3.2,3.3c4.7-0.1,9.3-0.1,14,0c3.2,0.1,4.3-1.2,4-4.3c0-7.7,0-9.7-0.2-22.9c0.1-2.6-0.9-3.5-3.2-3.6 c-5,0-10,0-15.1,0c-2,0-2.7,0.7-2.7,2.8C38.3,35.8,38.2,39.9,38.2,44.1z M48.1,24.6c7.5,0,15.1,0,22.7,0c3,0,3.7-1.2,2.1-3.8 c-2.3-3.9-6.3-5.3-10.4-6.1c-7.7-1.5-15.5-1.2-23.3-0.6c-5.5,0.4-11.3,1.3-14.8,6.6c-0.6,0.9-1.6,1.7-1,2.9c0.6,1.3,2,1,3.2,1H48.1 z M22.8,48.1c0-1.9-0.3-3.8-0.2-5.7c0.3-2-1-3.8-2.9-4.2c-2.3-0.9-4.8-1.4-7.3-1.3C8.9,37,6,39.4,5,42.6c-3,9.9,4.8,22.6,14.9,24.5 c2.3,0.4,3.1-0.3,3-2.6c-0.1-3.7,0-7.4,0-11.1 M48.5,9.7c2.1,0,4.3,0,6.4,0c0.7,0,1.5,0.2,1.9-0.7s-0.3-1.3-0.8-1.8	C52,3.6,45.2,4,41.2,7c-0.7,0.3-1,1.1-0.9,1.8c0.3,0.9,1.1,0.8,1.8,0.8L48.5,9.7z"/>
                            </svg>`;
                    break;

                case TABLEWARE.THERMOS:
                    result += `<svg viewBox="0 0 512 512" class="tableware-icon thermos">
                                <path d="m365.77 31.69c-2.77-14.06-15.1-24.19-29.43-24.19h-30l-12.84 182 91.58-60z" fill="#d12035"/>
                                <path d="m335.77 31.69 19.31 97.81-61.58 60-91.58-60 19.31-97.81c2.77-14.06 15.1-24.19 29.43-24.19h55.68c14.33 0 26.66 10.13 29.43 24.19z" fill="#ff2942"/>
                                <path d="m385.08 129.5 5.92 30-97.5 60 61.58-90z" fill="#b9c1ce"/>
                                <path d="m355.08 129.5 5.92 30-67.5 60-97.5-60 5.92-30z" fill="#dce0e7"/>
                                <path d="m121 219.5h90v30h-90z" fill="#b9c1ce"/>
                                <path d="m121 384.5h90v30h-90z" fill="#b9c1ce"/>
                                <path d="m121 204.5c8.28 0 15 6.72 15 15v195c0 8.28-6.72 15-15 15s-15-6.72-15-15v-195c0-8.28 6.72-15 15-15z" fill="#dce0e7"/>
                                <path d="m391 159.5h-30v90l45-60v-15c0-8.28-6.72-15-15-15z" fill="#95e1e1"/>
                                <path d="m376 174.5v105l-195-90v-15c0-8.28 6.72-15 15-15h165c8.28 0 15 6.72 15 15z" fill="#b2ffff"/>
                                <path d="m406 443.486v60h-30l-30-120z" fill="#95e1e1"/>
                                <path d="m376 353.486v150h-195v-60z" fill="#b2ffff"/>
                                <path d="m376 189.5-90 127.5 90 127.5h30v-255z" fill="#d12035"/>
                                <path d="m181 189.5h195v255h-195z" fill="#ff2942"/>
                                <path d="m397.344 152.91-24.211-122.671c-3.458-17.521-18.931-30.239-36.79-30.239h-85.686c-17.859 0-33.332 12.718-36.79 30.239l-24.211 122.671c-9.328 2.746-16.156 11.386-16.156 21.59v37.5h-31.285c-3.096-8.73-11.437-15-21.215-15-12.406 0-22.5 10.094-22.5 22.5v195c0 12.406 10.094 22.5 22.5 22.5 9.778 0 18.119-6.27 21.215-15h31.285v82.5c0 4.143 3.357 7.5 7.5 7.5h225c4.143 0 7.5-3.357 7.5-7.5v-330c0-10.204-6.828-18.844-16.156-21.59zm-168.76-119.766c2.074-10.513 11.357-18.144 22.073-18.144h85.686c10.716 0 19.999 7.631 22.073 18.144l17.538 88.856h-164.908zm-32.584 133.856c3.582 0 6.664-2.533 7.358-6.048l4.728-23.952h170.829l2.96 15h-155.875c-4.143 0-7.5 3.357-7.5 7.5s3.357 7.5 7.5 7.5h164.846c.084.002.168.001.254.001 4.09.054 7.4 3.396 7.4 7.499v7.5h-210v-7.5c0-4.136 3.364-7.5 7.5-7.5zm-22.5 210h-30v-120h30zm225-180v240h-210v-240zm-262.5 210c-4.143 0-7.5 3.357-7.5 7.5 0 4.136-3.364 7.5-7.5 7.5s-7.5-3.364-7.5-7.5v-195c0-4.136 3.364-7.5 7.5-7.5s7.5 3.364 7.5 7.5c0 4.143 3.357 7.5 7.5 7.5h37.5v15h-37.5c-4.143 0-7.5 3.357-7.5 7.5v135c0 4.143 3.357 7.5 7.5 7.5h37.5v15zm52.5 90v-45h210v45z"/>
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

        let randomizeTogglerButton = document.getElementById(ELEMENT_ID.RANDOMIZER_TOGGLER);
        randomizeTogglerButton.addEventListener("click", this.handleToggleRandomizer);
        let randomizeSubmitButton = document.getElementById(ELEMENT_ID.RANDOMIZER_SUBMIT);
        if (randomizeSubmitButton) {
            randomizeSubmitButton.addEventListener("click", this.handleSubmitRandomizer);
        }
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

    handleToggleRandomizer() {
        if (this.isRandomizerEnabled) {
            this.randomTeaInfo = null;
            this.randomizerCategories = [];
            this.randomizerTags = [];
        } else {
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
            let teaFiltered = this.data[category].filter((elem) => {
                let teaTags = elem[KEYS_MAP.TAGS].split(",").map(elem => elem.trim());
                let tagsDiff = this.randomizerTags.filter(tag => !teaTags.includes(tag));
                return tagsDiff.length === 0;
            });

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
}

const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/13gZJCXrIJ7dBWW-TaZ0c_CDD0pYNnZhVdrQD98VDcQE/edit?usp=sharing';

const teaGallery = new TeaGallery("container", publicSpreadsheetUrl);
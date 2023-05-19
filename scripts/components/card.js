import { DATA_KEY, KEYS_MAP, TABLEWARE, TEA_GROUP_CLASS_NAME } from "../constants.js";
import { ClayIcon, GlassIcon, PorcelainIcon, TeapotIcon, ThermosIcon } from "../icons.js";
import { TemperatureBar } from "./temperatureBar.js";
import { TimeBar } from "./timeBar.js";

export class Card {
    #container;
    #data = {};
    #domElem;

    constructor(container, data) {
        if (!data) {
            throw Error("Constructor param  data is missing");
        }

        if (!container) {
            throw Error("Constructor param container is missing");
        }

        this.#container = container;
        this.#data = data;
    }

    render() {
        this.#domElem = document.createElement("div");
        this.#domElem.classList.add("tea-card");
        this.#domElem.classList.add(`tea-category-${TEA_GROUP_CLASS_NAME[this.#data[DATA_KEY.GROUP]]}`);
        if (!this.#data[KEYS_MAP.IN_STOCK]) {
            this.#domElem.classList.add("out-of-stock");
        }

        let content = "";
        content += this.#getGroup(this.#data[DATA_KEY.GROUP]);
        content += this.#getRating(this.#data[KEYS_MAP.RATING]);
        content += `<h6 class="tea-name">${this.#data[DATA_KEY.NAME]}</h6>`;
        content += this.#getBrewingTime(this.#data[DATA_KEY.BREWING_TIME]);
        content += this.#getTemperature(this.#data[DATA_KEY.TEMPERATURE]);
        content += this.#getTableware(this.#data[DATA_KEY.TABLEWARE]);
        content += this.#getPrice(this.#data[DATA_KEY.PRICE]);
        content += this.#getTags(this.#data[DATA_KEY.TAGS]);
        content += this.#getReview(this.#data[DATA_KEY.REVIEW]);

        this.#domElem.innerHTML = content;
        this.#container.appendChild(this.#domElem);
    }

    getId() {
        return this.#data.id;
    }

    hide() {
        this.#domElem.classList.add("undisplayed");
    }

    show() {
        this.#domElem.classList.remove("undisplayed");
    }

    #getRating(rating) {
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

    #getGroup(group) {
        let result = "";
        result += '<div class="tea-category-icon-container tea-category-' + TEA_GROUP_CLASS_NAME[group] + '">';
        result += `<span class="tea-category-icon icon-leaf"></span>`;
        result += "</div>";
        return result;
    }

    #getBrewingTime(time) {
        if (time) {
            return this.#getParam(DATA_KEY.BREWING_TIME, new TimeBar(time).renderToString());
        } else {
            return this.#getEmptyParam(DATA_KEY.BREWING_TIME);
        }
    }

    #getTemperature(temperature) {
        if (temperature) {
            return this.#getParam(DATA_KEY.TEMPERATURE, new TemperatureBar(temperature).renderToString());
        } else {
            return this.#getEmptyParam(DATA_KEY.TEMPERATURE);
        }
    }

    #getTableware(tableware) {
        if (tableware) {
            let content = "";
            content += '<div class="tea-tableware-container">';

            let tablewareArray = tableware
                .split(",")
                .map((elem) => elem.trim())
                .sort();

            tablewareArray.forEach((elem) => {
                content += '<div class="tea-tableware-icon-container">';
                switch (elem) {
                    case TABLEWARE.CLAY:
                        content += ClayIcon;
                        break;

                    case TABLEWARE.PORCELAIN:
                        content += PorcelainIcon;
                        break;

                    case TABLEWARE.TEAPOT:
                        content += TeapotIcon;
                        break;

                    case TABLEWARE.GLASS:
                        content += GlassIcon;
                        break;

                    case TABLEWARE.THERMOS:
                        content += ThermosIcon;
                        break;

                    default:
                        break;
                }
                content += "</div>";
            });
            content += "</div>";

            return this.#getParam(DATA_KEY.TEMPERATURE, content);
        } else {
            return this.#getEmptyParam(DATA_KEY.TABLEWARE);
        }
    }

    #getPrice(price) {
        if (price) {
            return this.#getParam(DATA_KEY.PRICE, price + "$");
        } else {
            return this.#getEmptyParam(DATA_KEY.PRICE);
        }
    }

    #getTags(tags) {
        if (tags.length > 0) {
            let content = "";
            content += '<div class="tea-tags-container">';

            tags.forEach((tag) => {
                // TODO: Replace with tag component (without hover and cursor pointer)
                content += '<div class="tea-tag selected disabled">';
                content += tag;
                content += "</div>";
            });

            content += "</div>";

            return this.#getParam(DATA_KEY.TAGS, content);
        } else {
            return this.#getEmptyParam(DATA_KEY.TAGS);
        }
    }

    #getReview(review) {
        if (review) {
            return this.#getParam(DATA_KEY.REVIEW, review);
        } else {
            return this.#getEmptyParam(DATA_KEY.REVIEW);
        }
    }

    #getParam(name, content) {
        let result = "";
        result += '<div class="tea-param">';
        result += "<b>" + name + "</b>: ";
        result += content;
        result += "</div>";
        return result;
    }

    #getEmptyParam(name) {
        return '<div class="tea-param"><b>' + name + "</b>: ---</div>";
    }
}

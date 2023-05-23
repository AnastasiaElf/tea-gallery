import { TABLEWARE } from "../constants.js";
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
        this.#domElem.classList.add(`tea-group-${this.#data.group}`);
        if (!this.#data.inStock) {
            this.#domElem.classList.add("out-of-stock");
        }

        let content = "";
        content += this.#getGroup();
        content += this.#getRating(this.#data.rating);
        content += `<h6 class="tea-name">${this.#data.name}</h6>`;
        content += this.#getBrewingTime(this.#data.brewingTime);
        content += this.#getTemperature(this.#data.temperature);
        content += this.#getTableware(this.#data.tableware);
        content += this.#getPrice(this.#data.price);
        content += this.#getTags(this.#data.tags);
        content += this.#getReview(this.#data.review);

        this.#domElem.innerHTML = content;
        this.#container.appendChild(this.#domElem);
    }

    getId() {
        return this.#data.id;
    }

    hide() {
        this.#domElem.classList.add("hidden");
    }

    show() {
        this.#domElem.classList.remove("hidden");
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

    #getGroup() {
        let result = "";
        result += '<div class="tea-group-icon-container">';
        result += `<span class="tea-group-icon icon-leaf"></span>`;
        result += "</div>";
        return result;
    }

    #getBrewingTime(time) {
        const label = "Brewing time";
        if (time) {
            return this.#getParam(label, new TimeBar(time).renderToString());
        } else {
            return this.#getEmptyParam(label);
        }
    }

    #getTemperature(temperature) {
        const label = "Temperature";
        if (temperature) {
            return this.#getParam(label, new TemperatureBar(temperature).renderToString());
        } else {
            return this.#getEmptyParam(label);
        }
    }

    #getTableware(tableware) {
        const label = "Tableware";
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
                    case TABLEWARE.clay:
                        content += ClayIcon;
                        break;

                    case TABLEWARE.porcelain:
                        content += PorcelainIcon;
                        break;

                    case TABLEWARE.teapot:
                        content += TeapotIcon;
                        break;

                    case TABLEWARE.glass:
                        content += GlassIcon;
                        break;

                    case TABLEWARE.thermos:
                        content += ThermosIcon;
                        break;

                    default:
                        break;
                }
                content += "</div>";
            });
            content += "</div>";

            return this.#getParam(label, content);
        } else {
            return this.#getEmptyParam(label);
        }
    }

    #getPrice(price) {
        const label = "Price";
        if (price) {
            return this.#getParam(label, price + "$");
        } else {
            return this.#getEmptyParam(label);
        }
    }

    #getTags(tags) {
        const label = "Tags";
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

            return this.#getParam(label, content);
        } else {
            return this.#getEmptyParam(label);
        }
    }

    #getReview(review) {
        const label = "Review";
        if (review) {
            return this.#getParam(label, review);
        } else {
            return this.#getEmptyParam(label);
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

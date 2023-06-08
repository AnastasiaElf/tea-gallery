import { TABLEWARE, TAGS } from "../constants.js";
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
        this.#domElem.classList.add("tg-card");
        this.#domElem.classList.add(`tg-group-${this.#data.group}`);
        if (!this.#data.inStock) {
            this.#domElem.classList.add("tg-out-of-stock");
        }

        let content = "";
        content += this.#renderGroupToString();
        content += this.#renderRatingToString(this.#data.rating);
        content += `<h6 class="tg-card-name">${this.#data.name}</h6>`;
        content += this.#renderBrewingTimeToString(this.#data.brewingTime);
        content += this.#renderTemperatureToString(this.#data.temperature);
        content += this.#renderTablewareToString(this.#data.tableware);
        content += this.#renderPriceToString(this.#data.price);
        content += this.#renderTagsToString(this.#data.tags);
        content += this.#renderReviewToString(this.#data.review);

        this.#domElem.innerHTML = content;
        this.#container.appendChild(this.#domElem);
    }

    getId() {
        return this.#data.id;
    }

    hide() {
        this.#domElem.classList.add("tg-hidden");
    }

    show() {
        this.#domElem.classList.remove("tg-hidden");
    }

    #renderRatingToString(rating) {
        if (!rating) {
            return "";
        }

        let result = "";
        result += '<div class="tg-card-rating">';

        for (let i = 0; i < 5; i++) {
            result += `<span class="tg-icon-star tg-rating-icon ${rating > i ? "filled" : ""}"></span>`;
        }

        result += "</div>";
        return result;
    }

    #renderGroupToString() {
        let result = "";
        result += '<div class="tg-group-icon-container">';
        result += `<span class="tg-group-icon tg-icon-leaf"></span>`;
        result += "</div>";
        return result;
    }

    #renderBrewingTimeToString(time) {
        const label = "Brewing time";

        if (!time) {
            return this.#renderEmptyParamToString(label);
        }

        return this.#renderParamToString(label, new TimeBar(time).renderToString());
    }

    #renderTemperatureToString(temperature) {
        const label = "Temperature";

        if (!temperature) {
            return this.#renderEmptyParamToString(label);
        }

        return this.#renderParamToString(label, new TemperatureBar(temperature).renderToString());
    }

    #renderTablewareToString(tableware) {
        const label = "Tableware";

        if (!tableware) {
            return this.#renderEmptyParamToString(label);
        }

        let content = "";
        content += '<div class="tg-tableware-container">';

        let tablewareArray = tableware
            .split(",")
            .map((elem) => elem.trim())
            .sort();

        tablewareArray.forEach((elem) => {
            const tablewareData = TABLEWARE[elem];
            content += `<div class="tg-tableware-icon-container" title="${tablewareData.label}">`;
            content += tablewareData.icon;
            content += "</div>";
        });
        content += "</div>";

        return this.#renderParamToString(label, content);
    }

    #renderPriceToString(price) {
        const label = "Price";

        if (!price) {
            return this.#renderEmptyParamToString(label);
        }

        return this.#renderParamToString(label, price + "$");
    }

    #renderTagsToString(tags) {
        const label = "Tags";

        if (!tags || tags.length === 0) {
            return this.#renderEmptyParamToString(label);
        }

        let content = "";
        content += '<div class="tg-tags-container">';

        tags.forEach((tag) => {
            content += '<div class="tg-tag tg-selected tg-disabled">';
            content += TAGS[tag].label;
            content += "</div>";
        });

        content += "</div>";

        return this.#renderParamToString(label, content);
    }

    #renderReviewToString(review) {
        const label = "Review";

        if (!review) {
            return this.#renderEmptyParamToString(label);
        }

        return this.#renderParamToString(label, review);
    }

    #renderParamToString(name, content) {
        let result = "";
        result += '<div class="tg-card-param">';
        result += "<b>" + name + "</b>: ";
        result += content;
        result += "</div>";
        return result;
    }

    #renderEmptyParamToString(name) {
        return '<div class="tg-card-param"><b>' + name + "</b>: ---</div>";
    }
}

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

        this.#domElem.innerHTML = `${this.#renderGroupToString()}
        ${this.#renderRatingToString(this.#data.rating)}
        <h6 class="tg-card-name">${this.#data.name}</h6>
        ${this.#renderBrewingTimeToString(this.#data.brewingTime)}
        ${this.#renderTemperatureToString(this.#data.temperature)}
        ${this.#renderTablewareToString(this.#data.tableware)}
        ${this.#renderPriceToString(this.#data.price)}
        ${this.#renderTagsToString(this.#data.tags)}
        ${this.#renderReviewToString(this.#data.review)}`;

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

        const items = [];
        for (let i = 0; i < 5; i++) {
            items.push(`<span class="tg-icon-star tg-rating-icon ${rating > i ? "filled" : ""}"></span>`);
        }

        return `<div class="tg-card-rating">
            ${items.join("")}
        </div>`;
    }

    #renderGroupToString() {
        return `<div class="tg-group-icon-container">
            <span class="tg-group-icon tg-icon-leaf"></span>
        </div>`;
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

        const items = tableware.map((elem) => {
            const tablewareData = TABLEWARE[elem];
            return `<div class="tg-tableware-icon-container" title="${tablewareData.label}">
                    ${tablewareData.icon}
                </div>
            `;
        });

        const content = `<div class="tg-tableware-container">
            ${items.join("")}
        </div>`;

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

        const items = tags.map((tag) => {
            return `<div class="tg-tag tg-selected tg-disabled">
                ${TAGS[tag].label}
            </div>`;
        });

        const content = `<div class="tg-tags-container">
            ${items.join("")}
        </div>`;

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
        return `<div class="tg-card-param">
            <b>${name}</b>: ${content}
        </div>`;
    }

    #renderEmptyParamToString(name) {
        return `<div class="tg-card-param"><b>${name}</b>: ---</div>`;
    }
}

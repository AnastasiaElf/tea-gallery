import { DOM_ELEMENT_ID, IN_STOCK_OPTIONS, IN_STOCK_LABELS, TAGS, TAG_LABELS } from "./../constants.js";

const IN_STOCK_OPTIONS_LIST = [IN_STOCK_OPTIONS.ALL, IN_STOCK_OPTIONS.IN_STOCK, IN_STOCK_OPTIONS.OUT_OF_STOCK];
const TAG_LIST = Object.keys(TAGS);

export class Settings {
    #container;
    #domElem;
    #data;

    constructor(container, data) {
        if (!data) {
            throw Error("Constructor param data is missing");
        }

        if (!container) {
            throw Error("Constructor param container is missing");
        }

        this.#data = data;
        this.#container = container;
    }

    render() {
        this.#domElem = document.createElement("div");
        this.#domElem.classList.add("settings");

        let content = "";
        content += this.#getInStockOptions();
        content += this.#getTagList();

        this.#domElem.innerHTML = content;
        this.#container.appendChild(this.#domElem);
    }

    #getInStockOptions() {
        let selectedOption = this.#data.inStock;
        let result = `<div id="${DOM_ELEMENT_ID.IN_STOCK_OPTIONS}" class="tea-stock-type-container">`;

        IN_STOCK_OPTIONS_LIST.forEach((option) => {
            result += `<div class="tea-stock-type ${
                selectedOption === option ? "selected" : ""
            }" data-in-stock-option="${option}">${IN_STOCK_LABELS[option]}</div>`;
        });

        result += "</div>";
        return result;
    }

    #getTagList() {
        let selectedTags = this.#data.tags;
        let result = `<div id="${DOM_ELEMENT_ID.TAG_LIST}" class="tea-tags-container">`;

        TAG_LIST.forEach((tag) => {
            let isSelected = selectedTags.includes(TAGS[tag]);

            result += `<div class="tea-tag ${isSelected ? "selected" : ""}" data-tag="${tag}">${TAG_LABELS[tag]}</div>`;
        });

        result += "</div>";
        return result;
    }
}

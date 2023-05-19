import {
    IN_STOCK_OPTIONS,
    IN_STOCK_LABELS,
    TAGS,
    TAG_LABELS,
    TEA_GROUP_CLASS_NAME,
    CATEGORIES_MAP,
    UPDATE_TYPE,
} from "./../constants.js";
import { RandomAndSearch } from "./randomAndSearch.js";

const IN_STOCK_OPTIONS_LIST = [IN_STOCK_OPTIONS.ALL, IN_STOCK_OPTIONS.IN_STOCK, IN_STOCK_OPTIONS.OUT_OF_STOCK];
const TAG_LIST = Object.values(TAGS).sort();
const GROUP_LIST = Object.values(CATEGORIES_MAP).sort();

export class Settings {
    #container;
    #domElem;
    #data;
    #handleUpdate;
    #elements = {
        groups: [],
        stock: [],
        tags: [],
    };

    constructor(container, data, handleUpdate) {
        if (!data) {
            throw Error("Constructor param data is missing");
        }

        if (!container) {
            throw Error("Constructor param container is missing");
        }

        if (!handleUpdate) {
            throw Error("Constructor handleUpdate container is missing");
        }

        this.#data = data;
        this.#container = container;
        this.#handleUpdate = handleUpdate;
    }

    render() {
        this.#domElem = document.createElement("div");
        this.#domElem.classList.add("settings");

        this.#domElem.appendChild(this.#getGroups());
        this.#domElem.appendChild(this.#getStockOptions());
        this.#domElem.appendChild(this.#getTagList());

        let randomAndSearch = new RandomAndSearch(
            this.#domElem,
            this.#data,
            this.#handleRandomUpdate,
            this.#handleSearchUpdate
        );
        randomAndSearch.render();

        this.#container.appendChild(this.#domElem);
    }

    #getGroups() {
        const container = document.createElement("div");
        container.classList.add("tea-categories-container");

        GROUP_LIST.forEach((group) => {
            const element = document.createElement("div");
            element.classList.add("tea-category-container", `tea-category-${TEA_GROUP_CLASS_NAME[group]}`);
            element.dataset.group = group;
            element.addEventListener("click", this.#handleGroupChange(group));

            let content = "";
            content += `<div class="tea-category-icon-container tea-category-${TEA_GROUP_CLASS_NAME[group]}">
                <span class="tea-category-icon icon-leaf"></span>
            </div>`;
            content += ` <div class="tea-category-name">${group}</div>`;

            element.innerHTML = content;

            this.#elements.groups.push(element);
            container.appendChild(element);
        });

        return container;
    }

    #getStockOptions() {
        const container = document.createElement("div");
        container.classList.add("tea-stock-type-container");

        IN_STOCK_OPTIONS_LIST.forEach((option) => {
            const element = document.createElement("div");
            element.classList.add("tea-stock-type");
            element.dataset.stock = option;
            element.innerHTML = IN_STOCK_LABELS[option];
            element.addEventListener("click", this.#handleStockChange(option));

            if (this.#data.inStock === option) {
                element.classList.add("selected");
            }

            this.#elements.stock.push(element);
            container.appendChild(element);
        });

        return container;
    }

    #getTagList() {
        const container = document.createElement("div");
        container.classList.add("tea-tags-container");

        TAG_LIST.forEach((tag) => {
            const element = document.createElement("div");
            element.classList.add("tea-tag");
            element.dataset.tag = tag;
            element.innerHTML = tag;
            element.addEventListener("click", this.#handleTagChange(tag));

            this.#elements.tags.push(element);
            container.appendChild(element);
        });

        return container;
    }

    #handleGroupChange = (selectedGroup) => () => {
        this.#elements.groups.forEach((elem) => {
            const name = elem.dataset.group;

            if (name !== selectedGroup || this.#data.group === name) {
                elem.classList.remove("selected");
            } else {
                elem.classList.add("selected");
            }
        });

        this.#handleUpdate(UPDATE_TYPE.GROUP, selectedGroup);
    };

    #handleStockChange = (selectedOption) => () => {
        if (selectedOption !== this.#data.inStock) {
            this.#elements.stock.forEach((elem) => {
                const option = elem.dataset.stock;

                if (option !== selectedOption) {
                    elem.classList.remove("selected");
                } else {
                    elem.classList.add("selected");
                }
            });

            this.#handleUpdate(UPDATE_TYPE.STOCK, selectedOption);
        }
    };

    #handleTagChange = (selectedTag) => (e) => {
        const elem = this.#elements.tags.find((elem) => selectedTag === elem.dataset.tag);
        elem.classList.toggle("selected");

        this.#handleUpdate(UPDATE_TYPE.TAG, selectedTag);
    };

    #handleRandomUpdate = (value) => {
        this.#handleUpdate(UPDATE_TYPE.RANDOM, value);
    };

    #handleSearchUpdate = (value) => {
        this.#handleUpdate(UPDATE_TYPE.SEARCH, value);
    };
}

import { TAG, UPDATE_TYPE, STOCK, TEA_GROUP, STOCK_LABEL, TEA_GROUP_LABEL, TAG_LABEL } from "./../constants.js";
import { RandomAndSearch } from "./randomAndSearch.js";

const STOCK_OPTIONS_LIST = [STOCK.all, STOCK.inStock, STOCK.outOfStock];
const TAG_LIST = Object.values(TAG).sort();
const GROUP_LIST = Object.values(TEA_GROUP).sort();

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

        GROUP_LIST.forEach((groupId) => {
            const element = document.createElement("div");
            element.classList.add("tea-category-container", `tea-category-${groupId}`);
            element.dataset.group = groupId;
            element.addEventListener("click", this.#handleGroupChange(groupId));

            let content = "";
            content += `<div class="tea-category-icon-container tea-category-${groupId}">
                <span class="tea-category-icon icon-leaf"></span>
            </div>`;
            content += ` <div class="tea-category-name">${TEA_GROUP_LABEL[groupId]}</div>`;

            element.innerHTML = content;

            this.#elements.groups.push(element);
            container.appendChild(element);
        });

        return container;
    }

    #getStockOptions() {
        const container = document.createElement("div");
        container.classList.add("tea-stock-type-container");

        STOCK_OPTIONS_LIST.forEach((option) => {
            const element = document.createElement("div");
            element.classList.add("tea-stock-type");
            element.dataset.stock = option;
            element.innerHTML = STOCK_LABEL[option];
            element.addEventListener("click", this.#handleStockChange(option));

            if (this.#data.stock === option) {
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
            element.innerHTML = TAG_LABEL[tag];
            element.addEventListener("click", this.#handleTagChange(tag));

            this.#elements.tags.push(element);
            container.appendChild(element);
        });

        return container;
    }

    #handleGroupChange = (selectedGroup) => () => {
        this.#elements.groups.forEach((elem) => {
            const groupId = elem.dataset.group;

            if (groupId !== selectedGroup || this.#data.group === groupId) {
                elem.classList.remove("selected");
            } else {
                elem.classList.add("selected");
            }
        });

        this.#handleUpdate(UPDATE_TYPE.group, selectedGroup);
    };

    #handleStockChange = (selectedOption) => () => {
        if (selectedOption !== this.#data.stock) {
            this.#elements.stock.forEach((elem) => {
                const option = elem.dataset.stock;

                if (option !== selectedOption) {
                    elem.classList.remove("selected");
                } else {
                    elem.classList.add("selected");
                }
            });

            this.#handleUpdate(UPDATE_TYPE.stock, selectedOption);
        }
    };

    #handleTagChange = (selectedTag) => (e) => {
        const elem = this.#elements.tags.find((elem) => selectedTag === elem.dataset.tag);
        elem.classList.toggle("selected");

        this.#handleUpdate(UPDATE_TYPE.tag, selectedTag);
    };

    #handleRandomUpdate = (value) => {
        this.#handleUpdate(UPDATE_TYPE.random, value);
    };

    #handleSearchUpdate = (value) => {
        this.#handleUpdate(UPDATE_TYPE.search, value);
    };
}

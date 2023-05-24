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
        this.#domElem.classList.add("tg-settings");

        this.#domElem.appendChild(this.#getGroupsElem());
        this.#domElem.appendChild(this.#getStockOptionsElem());
        this.#domElem.appendChild(this.#getTagListElem());

        let randomAndSearch = new RandomAndSearch(
            this.#domElem,
            this.#data,
            this.#handleRandomUpdate,
            this.#handleSearchUpdate
        );
        randomAndSearch.render();

        this.#container.appendChild(this.#domElem);
    }

    #getGroupsElem() {
        const container = document.createElement("div");
        container.classList.add("tg-settings-row");

        GROUP_LIST.forEach((groupId) => {
            const element = document.createElement("div");
            element.classList.add("tg-group-button", `tg-group-${groupId}`);
            element.dataset.group = groupId;
            element.addEventListener("click", this.#handleGroupChange(groupId));

            let content = "";
            content += '<div class="tg-group-icon-container">';
            content += '<span class="tg-group-icon tg-icon-leaf"></span>';
            content += "</div>";
            content += `<div class="tg-group-name">${TEA_GROUP_LABEL[groupId]}</div>`;

            element.innerHTML = content;

            this.#elements.groups.push(element);
            container.appendChild(element);
        });

        return container;
    }

    #getStockOptionsElem() {
        const container = document.createElement("div");
        container.classList.add("tg-settings-row");

        STOCK_OPTIONS_LIST.forEach((option) => {
            const element = document.createElement("div");
            element.classList.add("tg-tag");
            element.dataset.stock = option;
            element.innerHTML = STOCK_LABEL[option];
            element.addEventListener("click", this.#handleStockChange(option));

            if (this.#data.stock === option) {
                element.classList.add("tg-selected");
            }

            this.#elements.stock.push(element);
            container.appendChild(element);
        });

        return container;
    }

    #getTagListElem() {
        const container = document.createElement("div");
        container.classList.add("tg-settings-row");

        TAG_LIST.forEach((tag) => {
            const element = document.createElement("div");
            element.classList.add("tg-tag");
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
                elem.classList.remove("tg-selected");
            } else {
                elem.classList.add("tg-selected");
            }
        });

        this.#handleUpdate(UPDATE_TYPE.group, selectedGroup);
    };

    #handleStockChange = (selectedOption) => () => {
        if (selectedOption !== this.#data.stock) {
            this.#elements.stock.forEach((elem) => {
                const option = elem.dataset.stock;

                if (option !== selectedOption) {
                    elem.classList.remove("tg-selected");
                } else {
                    elem.classList.add("tg-selected");
                }
            });

            this.#handleUpdate(UPDATE_TYPE.stock, selectedOption);
        }
    };

    #handleTagChange = (selectedTag) => (e) => {
        const elem = this.#elements.tags.find((elem) => selectedTag === elem.dataset.tag);
        elem.classList.toggle("tg-selected");

        this.#handleUpdate(UPDATE_TYPE.tag, selectedTag);
    };

    #handleRandomUpdate = (value) => {
        this.#handleUpdate(UPDATE_TYPE.random, value);
    };

    #handleSearchUpdate = (value) => {
        this.#handleUpdate(UPDATE_TYPE.search, value);
    };
}

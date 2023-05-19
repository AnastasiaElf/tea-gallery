import { DOM_ELEMENT_ID } from "./../constants.js";

export class RandomAndSearch {
    #container;
    #data;
    #mainElem;
    #searchParamsElem;
    #randomParamsElem;

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
        this.#container.appendChild(this.#getRandomAndSearch());
        this.#container.appendChild(this.#getRandomParams());
        this.#container.appendChild(this.#getSearchParams());
    }

    #getRandomAndSearch() {
        this.#mainElem = document.createElement("div");
        this.#mainElem.classList.add("tea-randomizer-container");

        let content = `<button id="${DOM_ELEMENT_ID.RANDOM_ENABLE}" class="tea-button tea-button tea-button-margin-right">Random tea</button>`;
        content += `<button id="${DOM_ELEMENT_ID.SEARCH_ENABLE}" class="tea-button">Search</button>`;

        this.#mainElem.innerHTML = content;

        return this.#mainElem;
    }

    #getRandomParams() {
        this.#randomParamsElem = document.createElement("div");
        this.#randomParamsElem.classList.add("tea-randomizer-container");

        let content = `<button id="${DOM_ELEMENT_ID.RANDOM_SUBMIT}" class="tea-button tea-button tea-button-margin-right">Random tea</button>`;
        content += `<button id="${DOM_ELEMENT_ID.RANDOM_RETURN}" class="tea-button">Back</button>`;

        this.#randomParamsElem.innerHTML = content;

        return this.#randomParamsElem;
    }

    #getSearchParams() {
        this.#searchParamsElem = document.createElement("div");
        this.#searchParamsElem.classList.add("tea-search-container");

        let content = `<input id="${
            DOM_ELEMENT_ID.SEARCH_INPUT
        }" class="tea-input tea-search-input" type="text" placeholder="Type text here..." value="${
            this.#data.searchValue
        }"></input>`;
        content += '<div class="tea-search-buttons-container">';
        content += `<button id="${DOM_ELEMENT_ID.SEARCH_SUBMIT}" class="tea-button tea-search-button tea-button-margin-right">Search</button>`;
        content += `<button id="${DOM_ELEMENT_ID.SEARCH_RETURN}" class="tea-button tea-search-clear-button">Back</button>`;

        this.#searchParamsElem.innerHTML = content;

        return this.#searchParamsElem;
    }
}

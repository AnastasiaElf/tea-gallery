export class RandomAndSearch {
    #container;
    #data;
    #handleRandomUpdate;
    #handleSearchUpdate;
    #elements = {
        main: null,
        random: null,
        search: null,
        searchInput: null,
    };

    constructor(container, data, handleRandomUpdate, handleSearchUpdate) {
        if (!data) {
            throw Error("Constructor param data is missing");
        }

        if (!container) {
            throw Error("Constructor param container is missing");
        }

        if (!handleRandomUpdate) {
            throw Error("Constructor handleRandomUpdate container is missing");
        }

        if (!handleSearchUpdate) {
            throw Error("Constructor handleSearchUpdate container is missing");
        }

        this.#data = data;
        this.#container = container;
        this.#handleRandomUpdate = handleRandomUpdate;
        this.#handleSearchUpdate = handleSearchUpdate;
    }

    render() {
        this.#container.appendChild(this.#getRandomAndSearchElem());
        this.#container.appendChild(this.#getRandomParamElem());
        this.#container.appendChild(this.#getSearchParamsElem());
    }

    #getRandomAndSearchElem() {
        this.#elements.main = document.createElement("div");
        this.#elements.main.classList.add("tg-button-group");

        const randomButton = document.createElement("button");
        randomButton.classList.add("tg-button");
        randomButton.innerHTML = "Random tea";
        randomButton.addEventListener("click", this.#enableRandom);

        const searchButton = document.createElement("button");
        searchButton.classList.add("tg-button");
        searchButton.innerHTML = "Search";
        searchButton.addEventListener("click", this.#enableSearch);

        this.#elements.main.appendChild(randomButton);
        this.#elements.main.appendChild(searchButton);

        return this.#elements.main;
    }

    #getRandomParamsElem() {
        this.#elements.random = document.createElement("div");
        this.#elements.random.classList.add("tg-button-group");
        this.#elements.random.classList.add("tg-hidden");

        const randomButton = document.createElement("button");
        randomButton.classList.add("tg-button");
        randomButton.innerHTML = "Randomize";
        randomButton.addEventListener("click", this.#handleRandomSubmit);

        const backButton = document.createElement("button");
        backButton.classList.add("tg-button");
        backButton.innerHTML = "Back";
        backButton.addEventListener("click", this.#disableRandom);

        this.#elements.random.appendChild(randomButton);
        this.#elements.random.appendChild(backButton);

        return this.#elements.random;
    }

    #getSearchParamsElem() {
        this.#elements.search = document.createElement("div");
        this.#elements.search.classList.add("tg-search-container");
        this.#elements.search.classList.add("tg-hidden");

        this.#elements.searchInput = document.createElement("input");
        this.#elements.searchInput.classList.add("tg-input");
        this.#elements.searchInput.type = "text";
        this.#elements.searchInput.placeholder = "Type text here...";
        this.#elements.searchInput.value = this.#data.searchValue;

        const buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add("tg-button-group");

        const searchButton = document.createElement("button");
        searchButton.classList.add("tg-button");
        searchButton.innerHTML = "Search";
        searchButton.addEventListener("click", this.#handleSearchSubmit);

        const backButton = document.createElement("button");
        backButton.classList.add("tg-button");
        backButton.innerHTML = "Back";
        backButton.addEventListener("click", this.#disableSearch);

        buttonsContainer.appendChild(searchButton);
        buttonsContainer.appendChild(backButton);

        this.#elements.search.appendChild(this.#elements.searchInput);
        this.#elements.search.appendChild(buttonsContainer);

        return this.#elements.search;
    }

    #enableRandom = () => {
        this.#elements.main.classList.add("tg-hidden");
        this.#elements.random.classList.remove("tg-hidden");
    };

    #disableRandom = () => {
        this.#elements.main.classList.remove("tg-hidden");
        this.#elements.random.classList.add("tg-hidden");
        this.#handleRandomUpdate(false);
    };

    #enableSearch = () => {
        this.#elements.main.classList.add("tg-hidden");
        this.#elements.search.classList.remove("tg-hidden");
    };

    #disableSearch = () => {
        this.#elements.main.classList.remove("tg-hidden");
        this.#elements.search.classList.add("tg-hidden");
        this.#elements.searchInput.value = "";
        this.#handleSearchUpdate(this.#elements.searchInput.value);
    };

    #handleRandomSubmit = () => {
        this.#handleRandomUpdate(true);
    };

    #handleSearchSubmit = () => {
        this.#handleSearchUpdate(this.#elements.searchInput.value);
    };
}

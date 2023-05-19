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
        this.#container.appendChild(this.#getRandomAndSearch());
        this.#container.appendChild(this.#getRandomParams());
        this.#container.appendChild(this.#getSearchParams());
    }

    #getRandomAndSearch() {
        this.#elements.main = document.createElement("div");
        this.#elements.main.classList.add("tea-randomizer-container");

        const randomButton = document.createElement("button");
        randomButton.classList.add("tea-button", "tea-button-margin-right");
        randomButton.innerHTML = "Random tea";
        randomButton.addEventListener("click", this.#enableRandom);

        const searchButton = document.createElement("button");
        searchButton.classList.add("tea-button");
        searchButton.innerHTML = "Search";
        searchButton.addEventListener("click", this.#enableSearch);

        this.#elements.main.appendChild(randomButton);
        this.#elements.main.appendChild(searchButton);

        return this.#elements.main;
    }

    #getRandomParams() {
        this.#elements.random = document.createElement("div");
        this.#elements.random.classList.add("tea-randomizer-container");
        this.#elements.random.classList.add("undisplayed");

        const randomButton = document.createElement("button");
        randomButton.classList.add("tea-button", "tea-button-margin-right");
        randomButton.innerHTML = "Randomize";
        randomButton.addEventListener("click", this.#handleRandomSubmit);

        const backButton = document.createElement("button");
        backButton.classList.add("tea-button");
        backButton.innerHTML = "Back";
        backButton.addEventListener("click", this.#disableRandom);

        this.#elements.random.appendChild(randomButton);
        this.#elements.random.appendChild(backButton);

        return this.#elements.random;
    }

    #getSearchParams() {
        this.#elements.search = document.createElement("div");
        this.#elements.search.classList.add("tea-search-container");
        this.#elements.search.classList.add("undisplayed");

        this.#elements.searchInput = document.createElement("input");
        this.#elements.searchInput.classList.add("tea-input", "tea-search-input");
        this.#elements.searchInput.type = "text";
        this.#elements.searchInput.placeholder = "Type text here...";
        this.#elements.searchInput.value = this.#data.searchValue;

        const buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add("tea-search-buttons-container");

        const searchButton = document.createElement("button");
        searchButton.classList.add("tea-button", "tea-button-margin-right");
        searchButton.innerHTML = "Search";
        searchButton.addEventListener("click", this.#handleSearchSubmit);

        const backButton = document.createElement("button");
        backButton.classList.add("tea-button");
        backButton.innerHTML = "Back";
        backButton.addEventListener("click", this.#disableSearch);

        buttonsContainer.appendChild(searchButton);
        buttonsContainer.appendChild(backButton);

        this.#elements.search.appendChild(this.#elements.searchInput);
        this.#elements.search.appendChild(buttonsContainer);

        return this.#elements.search;
    }

    #enableRandom = () => {
        this.#elements.main.classList.add("undisplayed");
        this.#elements.random.classList.remove("undisplayed");
    };

    #disableRandom = () => {
        this.#elements.main.classList.remove("undisplayed");
        this.#elements.random.classList.add("undisplayed");
        this.#handleRandomUpdate(false);
    };

    #enableSearch = () => {
        this.#elements.main.classList.add("undisplayed");
        this.#elements.search.classList.remove("undisplayed");
    };

    #disableSearch = () => {
        this.#elements.main.classList.remove("undisplayed");
        this.#elements.search.classList.add("undisplayed");
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

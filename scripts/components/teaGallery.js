import { TEA_GROUP_NAME, DATA_KEY, IN_STOCK_OPTIONS, PAGE, UPDATE_TYPE } from "./../constants.js";
import { CardGroup } from "./cardGroup.js";
import { Settings } from "./settings.js";
import { Statistics } from "./statistics.js";

export class TeaGallery {
    #container;
    #data = [];
    #settings = {
        group: null,
        inStock: IN_STOCK_OPTIONS.ALL,
        tags: [],
        randomEnabled: false,
        searchValue: "",
    };
    #currentPage = PAGE.TEA_GALLERY;
    #elements = {
        contentToggle: null,
        statisticsPage: null,
        teaGalleryPage: null,
    };
    #objects = {
        statistics: null,
        settings: null,
        groups: [],
    };

    constructor(container, data) {
        if (!data) {
            throw Error("Constructor param data is missing");
        }

        if (!container) {
            throw Error("Constructor param container is missing");
        }

        this.#container = container;
        this.#setData(data);
    }

    render() {
        this.#container.appendChild(this.#getControls());

        this.#elements.statisticsPage = document.createElement("div");
        this.#elements.statisticsPage.classList.add("page-content-container");
        this.#container.appendChild(this.#elements.statisticsPage);
        this.#elements.statisticsPage.classList.add("hidden");

        this.#objects.statistics = new Statistics(this.#elements.statisticsPage, this.#data);
        this.#objects.statistics.render();

        this.#elements.teaGalleryPage = document.createElement("div");
        this.#elements.teaGalleryPage.classList.add("page-content-container");
        this.#container.appendChild(this.#elements.teaGalleryPage);

        this.#objects.settings = new Settings(
            this.#elements.teaGalleryPage,
            this.#settings,
            this.#handleSettingsUpdate
        );
        this.#objects.settings.render();

        this.#data.forEach((groupData) => {
            const group = new CardGroup(this.#elements.teaGalleryPage, groupData);
            this.#objects.groups.push(group);
            group.render();
        });
    }

    #setData(data) {
        this.#data = [];
        let groupsData = {};

        Object.values(TEA_GROUP_NAME).forEach((groupName) => {
            groupsData[groupName] = { name: groupName, items: [] };
        });

        data.forEach((item) => {
            const groupName = item[DATA_KEY.GROUP];

            groupsData[groupName].items.push({
                ...item,
                [DATA_KEY.IN_STOCK]: JSON.parse(item[DATA_KEY.IN_STOCK].toLowerCase()),
            });
        });

        Object.keys(groupsData)
            .sort()
            .forEach((groupName) => {
                let groupData = groupsData[groupName];

                groupData.stats = {};
                groupData.stats.total = groupData.items.length;
                groupData.stats.inStock = groupData.items.reduce(
                    (sum, item) => (item[DATA_KEY.IN_STOCK] ? ++sum : sum),
                    0
                );
                groupData.stats.outOfStock = groupData.stats.total - groupData.stats.inStock;

                this.#data.push(groupData);
            });
    }

    #getControls() {
        const container = document.createElement("div");
        container.classList.add("tea-statistics-container");

        this.#elements.contentToggle = document.createElement("button");
        this.#elements.contentToggle.classList.add("tea-button");
        this.#elements.contentToggle.addEventListener("click", this.#handleToggleContent);
        this.#elements.contentToggle.innerHTML = "Statistics";

        container.appendChild(this.#elements.contentToggle);

        return container;
    }

    #handleToggleContent = () => {
        switch (this.#currentPage) {
            case PAGE.STATISTICS:
                this.#currentPage = PAGE.TEA_GALLERY;
                this.#elements.contentToggle.innerHTML = "Statistics";
                this.#elements.statisticsPage.classList.add("hidden");
                this.#elements.teaGalleryPage.classList.remove("hidden");

                break;

            case PAGE.TEA_GALLERY:
                this.#currentPage = PAGE.STATISTICS;
                this.#elements.contentToggle.innerHTML = "Tea Gallery";
                this.#elements.statisticsPage.classList.remove("hidden");
                this.#elements.teaGalleryPage.classList.add("hidden");

                break;

            default:
                break;
        }
    };

    #handleSettingsUpdate = (type, data) => {
        switch (type) {
            case UPDATE_TYPE.GROUP:
                this.#objects.groups.forEach((group) => {
                    const name = group.getName();
                    if (name !== data) {
                        group.hide();
                    } else {
                        group.show();
                    }
                });
                break;

            case UPDATE_TYPE.STOCK:
                // TODO: add logic
                break;

            case UPDATE_TYPE.TAG:
                // TODO: add logic
                break;

            case UPDATE_TYPE.RANDOM:
                // TODO: add logic
                break;

            case UPDATE_TYPE.SEARCH:
                // TODO: add logic
                break;

            default:
                break;
        }
    };
}

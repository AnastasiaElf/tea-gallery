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
        this.#data = data;
    }

    render() {
        const data = this.#getGroupsData();

        this.#container.appendChild(this.#getControls());

        this.#elements.statisticsPage = document.createElement("div");
        this.#elements.statisticsPage.classList.add("page-content-container");
        this.#container.appendChild(this.#elements.statisticsPage);
        this.#elements.statisticsPage.classList.add("hidden");

        this.#objects.statistics = new Statistics(this.#elements.statisticsPage, data);
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

        data.forEach((groupData) => {
            const group = new CardGroup(this.#elements.teaGalleryPage, groupData);
            this.#objects.groups.push(group);
            group.render();
        });
    }

    #getGroupsData() {
        let groupsData = [];
        let groupsObject = {};

        Object.values(TEA_GROUP_NAME).forEach((groupName) => {
            groupsObject[groupName] = { name: groupName, items: [] };
        });

        this.#data.forEach((item) => {
            const groupName = item[DATA_KEY.GROUP];
            groupsObject[groupName].items.push(item);
        });

        Object.keys(groupsObject)
            .sort()
            .forEach((groupName) => {
                let groupData = groupsObject[groupName];

                groupData.stats = {};
                groupData.stats.total = groupData.items.length;
                groupData.stats.inStock = groupData.items.reduce(
                    (sum, item) => (item[DATA_KEY.IN_STOCK] ? ++sum : sum),
                    0
                );
                groupData.stats.outOfStock = groupData.stats.total - groupData.stats.inStock;

                groupsData.push(groupData);
            });

        return groupsData;
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
                if (this.#settings.group === data) {
                    this.#settings.group = null;
                } else {
                    this.#settings.group = data;
                }
                break;

            case UPDATE_TYPE.STOCK:
                this.#settings.inStock = data;
                break;

            case UPDATE_TYPE.TAG:
                const index = this.#settings.tags.indexOf(data);
                if (index === -1) {
                    this.#settings.tags.push(data);
                } else {
                    this.#settings.tags.splice(index, 1);
                }
                break;

            case UPDATE_TYPE.RANDOM:
                this.#settings.randomEnabled = data;
                break;

            case UPDATE_TYPE.SEARCH:
                this.#settings.searchValue = data;
                break;

            default:
                return;
        }

        this.#updateCardsVisibility();
    };

    #getVisibleCardIds() {
        let cardIds = [];
        const { group, inStock, tags, randomEnabled, searchValue } = this.#settings;

        this.#data.forEach((item) => {
            const matchSearch =
                searchValue === "" || item[DATA_KEY.NAME].toLowerCase().includes(searchValue.toLowerCase());

            const matchGroup = !group || item[DATA_KEY.GROUP] === group;
            const matchInStock =
                inStock === IN_STOCK_OPTIONS.ALL ||
                (inStock === IN_STOCK_OPTIONS.IN_STOCK && item[DATA_KEY.IN_STOCK]) ||
                (inStock === IN_STOCK_OPTIONS.OUT_OF_STOCK && !item[DATA_KEY.IN_STOCK]);

            const itemTags = item[DATA_KEY.TAGS];
            const matchTags =
                tags.length === 0 || (itemTags.length > 0 && tags.every((elem) => itemTags.includes(elem)));

            if (matchGroup && matchInStock && matchTags && matchSearch) {
                cardIds.push(item.id);
            }
        });

        if (randomEnabled) {
            cardIds = [cardIds[Math.floor(Math.random() * cardIds.length)]];
        }

        return cardIds;
    }

    #updateCardsVisibility() {
        const cardIds = this.#getVisibleCardIds();
        const { group } = this.#settings;

        this.#objects.groups.forEach((groupObj) => {
            const groupName = groupObj.getName();
            if (group && groupName !== group) {
                groupObj.hide();
            } else {
                const cards = groupObj.getCards();

                let counter = groupObj.getCardsAmount();
                cards.forEach((cardObj) => {
                    const cardId = cardObj.getId();

                    if (cardIds.includes(cardId)) {
                        cardObj.show();
                    } else {
                        cardObj.hide();
                        counter--;
                    }
                });

                if (counter > 0) {
                    groupObj.show();
                } else {
                    groupObj.hide();
                }
            }
        });
    }
}

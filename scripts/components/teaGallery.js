import { PAGE, UPDATE_TYPE, TEA_GROUP, STOCK } from "./../constants.js";
import { CardGroup } from "./cardGroup.js";
import { Settings } from "./settings.js";
import { Statistics } from "./statistics.js";

export class TeaGallery {
    #container;
    #data = [];
    #settings = {
        group: null,
        stock: STOCK.all,
        tags: [],
        randomEnabled: false,
        searchValue: "",
    };
    #currentPage = PAGE.teaGallery;
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
        this.#elements.statisticsPage.classList.add("tg-content");
        this.#container.appendChild(this.#elements.statisticsPage);
        this.#elements.statisticsPage.classList.add("tg-hidden");

        this.#objects.statistics = new Statistics(this.#elements.statisticsPage, data);
        this.#objects.statistics.render();

        this.#elements.teaGalleryPage = document.createElement("div");
        this.#elements.teaGalleryPage.classList.add("tg-content");
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

        Object.values(TEA_GROUP).forEach((groupId) => {
            groupsObject[groupId] = { id: groupId, items: [] };
        });

        this.#data.forEach((item) => {
            const groupId = item.group;
            groupsObject[groupId].items.push(item);
        });

        Object.keys(groupsObject)
            .sort()
            .forEach((group) => {
                let groupData = groupsObject[group];

                groupData.stats = {};
                groupData.stats.total = groupData.items.length;
                groupData.stats.inStock = groupData.items.reduce((sum, item) => (item.inStock ? ++sum : sum), 0);
                groupData.stats.outOfStock = groupData.stats.total - groupData.stats.inStock;

                groupsData.push(groupData);
            });

        return groupsData;
    }

    #getControls() {
        const container = document.createElement("div");
        container.classList.add("tg-menu");

        this.#elements.contentToggle = document.createElement("button");
        this.#elements.contentToggle.classList.add("tg-button");
        this.#elements.contentToggle.addEventListener("click", this.#handleToggleContent);
        this.#elements.contentToggle.innerHTML = "Statistics";

        container.appendChild(this.#elements.contentToggle);

        return container;
    }

    #handleToggleContent = () => {
        switch (this.#currentPage) {
            case PAGE.statistics:
                this.#currentPage = PAGE.teaGallery;
                this.#elements.contentToggle.innerHTML = "Statistics";
                this.#elements.statisticsPage.classList.add("tg-hidden");
                this.#elements.teaGalleryPage.classList.remove("tg-hidden");

                break;

            case PAGE.teaGallery:
                this.#currentPage = PAGE.statistics;
                this.#elements.contentToggle.innerHTML = "Tea Gallery";
                this.#elements.statisticsPage.classList.remove("tg-hidden");
                this.#elements.teaGalleryPage.classList.add("tg-hidden");

                break;

            default:
                break;
        }
    };

    #handleSettingsUpdate = (type, data) => {
        switch (type) {
            case UPDATE_TYPE.group:
                if (this.#settings.group === data) {
                    this.#settings.group = null;
                } else {
                    this.#settings.group = data;
                }
                break;

            case UPDATE_TYPE.stock:
                this.#settings.stock = data;
                break;

            case UPDATE_TYPE.tag:
                const index = this.#settings.tags.indexOf(data);
                if (index === -1) {
                    this.#settings.tags.push(data);
                } else {
                    this.#settings.tags.splice(index, 1);
                }
                break;

            case UPDATE_TYPE.random:
                this.#settings.randomEnabled = data;
                break;

            case UPDATE_TYPE.search:
                this.#settings.searchValue = data;
                break;

            default:
                return;
        }

        this.#updateCardsVisibility();
    };

    #getVisibleCardIds() {
        let cardIds = [];
        const { group, stock, tags, randomEnabled, searchValue } = this.#settings;

        this.#data.forEach((item) => {
            const matchSearch = searchValue === "" || item.name.toLowerCase().includes(searchValue.toLowerCase());

            const matchGroup = !group || item.group === group;
            const matchStock =
                stock === STOCK.all ||
                (stock === STOCK.inStock && item.inStock) ||
                (stock === STOCK.outOfStock && !item.inStock);

            const itemTags = item.tags;
            const matchTags =
                tags.length === 0 || (itemTags.length > 0 && tags.every((elem) => itemTags.includes(elem)));

            if (matchGroup && matchStock && matchTags && matchSearch) {
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
            const groupId = groupObj.getId();
            if (group && groupId !== group) {
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

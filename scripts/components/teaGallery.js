import { TEA_GROUP_NAME, DATA_KEY, IN_STOCK_OPTIONS, TAGS } from "./../constants.js";
import { CardGroup } from "./cardGroup.js";
import { Settings } from "./settings.js";

export class TeaGallery {
    #container;
    #data = [];
    #groups = [];
    #settings = {
        inStock: IN_STOCK_OPTIONS.ALL,
        tags: [],
        randomEnabled: false,
        searchValue: null,
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
        let settings = new Settings(this.#container, this.#settings);
        settings.render();

        this.#data.forEach((groupData) => {
            let group = new CardGroup(this.#container, groupData);
            this.#groups.push(group);
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
}

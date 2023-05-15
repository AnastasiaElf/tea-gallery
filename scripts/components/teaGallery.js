import { CATEGORIES_MAP, KEYS_MAP } from "./../constants.js";

export class TeaGallery {
    #container;
    #dataURL;
    #data = {};

    /**
     * Init
     * @param {string} containerId - Container ID.
     * @param {string} dataURL - Data URL.
     */
    constructor(containerId, dataURL) {
        if (!dataURL) {
            throw Error("Constructor param dataURL is missing");
        }

        if (!containerId) {
            throw Error("Constructor param containerId is missing");
        }

        this.#container = document.getElementById(containerId);

        if (!this.#container) {
            throw Error("Container is not found");
        }

        this.#dataURL = dataURL;
    }

    /**
     * Render component
     */
    render() {
        this.#fetchData().then((data) => {
            this.#setData(data);
            this.#container.innerHTML = this.#renderToString();
        });
    }

    #fetchData() {
        return new Promise((resolve, reject) => {
            Papa.parse(this.#dataURL, {
                download: true,
                header: true,
                complete(results) {
                    resolve(results.data);
                },
                error(err) {
                    reject(err);
                },
            });
        });
    }

    #setData(data) {
        this.#data = {};

        let reducedData = data.reduce((result, value) => {
            let category = value[KEYS_MAP.CATEGORY];

            result[category] = result[category] || [];
            result[category].push(value);

            return result;
        }, {});

        Object.values(CATEGORIES_MAP).forEach((category) => {
            let teaList = reducedData[category] || [];
            this.#data[category] = {
                name: category,
                teaList: teaList,
                totalAmount: teaList.length,
                inStockAmount: teaList.reduce(
                    (sum, tea) => (JSON.parse(tea[KEYS_MAP.IN_STOCK].toLowerCase()) ? ++sum : sum),
                    0
                ),
                outOfStockAmount: teaList.reduce(
                    (sum, tea) => (!JSON.parse(tea[KEYS_MAP.IN_STOCK].toLowerCase()) ? ++sum : sum),
                    0
                ),
            };
        });
    }

    #renderToString() {
        let result = "<div>HTML HERE</div>";
        return result;
    }
}

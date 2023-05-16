import { Card } from "./card.js";

export class CardGroup {
    #container;
    #data = {};
    #domElem;
    #cards = [];

    constructor(container, data) {
        if (!data) {
            throw Error("Constructor param  data is missing");
        }

        if (!container) {
            throw Error("Constructor param container is missing");
        }

        this.#container = container;
        this.#data = data;
    }

    render() {
        this.#domElem = document.createElement("div");
        this.#domElem.classList.add("table-container");

        let content = "";
        content += '<div class="table-divider"></div>';
        content += '<h5 class="table-name">';
        content += `${this.#data.name} (${this.#data.stats.inStock}/${this.#data.stats.total})`;
        content += "</h5>";
        let cardsContainer = document.createElement("div");
        cardsContainer.classList.add("table-data");

        this.#domElem.innerHTML = content;
        this.#domElem.appendChild(cardsContainer);
        this.#container.appendChild(this.#domElem);

        this.#data.items.forEach((item) => {
            let card = new Card(cardsContainer, item);
            this.#cards.push(card);
            card.render();
        });
    }

    getCards() {
        return this.#cards;
    }
}

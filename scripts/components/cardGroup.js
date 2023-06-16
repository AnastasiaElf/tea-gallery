import { TEA_GROUPS } from "../constants.js";
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
        this.#domElem.classList.add("tg-card-group");

        this.#domElem.innerHTML = `<div class="tg-card-group-divider"></div>
        <h5 class="tg-card-group-name">
            ${TEA_GROUPS[this.#data.id].label} (${this.#data.stats.inStock}/${this.#data.stats.total})
        </h5>`;

        const cardsContainer = document.createElement("div");
        cardsContainer.classList.add("tg-card-group-cards");

        this.#domElem.appendChild(cardsContainer);
        this.#container.appendChild(this.#domElem);

        this.#data.items.forEach((item) => {
            const card = new Card(cardsContainer, item);
            this.#cards.push(card);
            card.render();
        });
    }

    getCards() {
        return this.#cards;
    }

    getId() {
        return this.#data.id;
    }

    getCardsAmount() {
        return this.#data.stats.total;
    }

    hide() {
        this.#domElem.classList.add("tg-hidden");
    }

    show() {
        this.#domElem.classList.remove("tg-hidden");
    }
}

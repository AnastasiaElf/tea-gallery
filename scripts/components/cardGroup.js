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
        this.#domElem.innerHTML = this.#data.name;
        this.#container.appendChild(this.#domElem);
        this.#data.items.forEach((item) => {
            let card = new Card(this.#domElem, item);
            this.#cards.push(card);
            card.render();
        });
    }

    getCards() {
        return this.#cards;
    }
}

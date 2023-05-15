import { DATA_KEY } from "../constants.js";

export class Card {
    #container;
    #data = {};
    #domElem;

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
        this.#domElem.innerHTML = this.#data[DATA_KEY.NAME];
        this.#container.appendChild(this.#domElem);
    }
}

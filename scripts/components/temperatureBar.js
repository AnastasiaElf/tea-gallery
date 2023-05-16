import { DATA_KEY } from "../constants.js";

export class TemperatureBar {
    #minTemp;
    #maxTemp;

    constructor(temperature) {
        if (!temperature) {
            throw Error("Constructor param temperature is missing");
        }

        let tempArray = temperature.split("-").map((elem) => parseInt(elem));
        this.#minTemp = tempArray[0];
        this.#maxTemp = tempArray[1];
    }

    renderToString() {
        let result = "";

        result += '<div class="tea-temperature-container">';
        result += '<div class="temperature-bar">';
        result += `<div class="temperature-bar-overlap" style="width: ${this.#minTemp}%;"></div>`;
        result += "</div>";
        result += '<div class="temperature-value">';
        result += `${this.#minTemp} ${this.#maxTemp ? " - " + this.#maxTemp : ""} °C`;
        result += "</div>";
        result += "</div>";

        return result;
    }
}

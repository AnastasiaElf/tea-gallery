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

        result += '<div class="tg-progress-bar-container">';
        result += '<div class="tg-progress-bar">';
        result += `<div class="tg-progress-bar-overlap" style="width: ${this.#minTemp}%;"></div>`;
        result += "</div>";
        result += '<div class="tg-progress-bar-value">';
        result += `${this.#minTemp} ${this.#maxTemp ? " - " + this.#maxTemp : ""} °C`;
        result += "</div>";
        result += "</div>";

        return result;
    }
}

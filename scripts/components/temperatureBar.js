export class TemperatureBar {
    #minTemp;
    #maxTemp;

    constructor(temperature) {
        if (!temperature) {
            throw Error("Constructor param temperature is missing");
        }

        const tempArray = temperature.split("-").map((elem) => parseInt(elem));
        this.#minTemp = tempArray[0];
        this.#maxTemp = tempArray[1];
    }

    renderToString() {
        return `<div class="tg-progress-bar-container">
            <div class="tg-progress-bar">
                <div class="tg-progress-bar-overlap" style="width: ${this.#minTemp}%;"></div>
            </div>
            <div class="tg-progress-bar-value">
                ${this.#minTemp}${this.#maxTemp ? " - " + this.#maxTemp : ""} °C
            </div>
        </div>`;
    }
}

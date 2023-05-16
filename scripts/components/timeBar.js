import { DATA_KEY } from "../constants.js";

export class TimeBar {
    #minTime;
    #maxTime;
    #timeFrom;
    #timeTo;

    constructor(time) {
        if (!time) {
            throw Error("Constructor param time is missing");
        }

        let timeArray = time.split("-").map((elem) => parseInt(elem));
        this.#minTime = timeArray[0];
        this.#maxTime = timeArray[1];

        if (this.#maxTime) {
            if (this.#maxTime >= 60) {
                let minutesTo =
                    this.#maxTime % 60 === 0 ? (this.#maxTime / 60).toFixed(0) : (this.#maxTime / 60).toFixed(1);
                this.#timeTo = { value: minutesTo, unit: "min" };
            } else {
                this.#timeTo = { value: this.#maxTime, unit: "sec" };
            }
        }

        if (this.#minTime >= 60) {
            let minutesFrom =
                this.#minTime % 60 === 0 ? (this.#minTime / 60).toFixed(0) : (this.#minTime / 60).toFixed(1);
            this.#timeFrom = { value: minutesFrom, unit: "min" };
        } else {
            this.#timeFrom = { value: this.#minTime, unit: "sec" };
        }
    }

    renderToString() {
        let result = "";

        result += '<div class="tea-brewing-time-container">';
        result += '<div class="time-bar">';
        result += `<div class="time-bar-overlap" style="width: ${
            this.#maxTime
                ? this.#maxTime < 60
                    ? this.#maxTime
                    : 100
                : this.#minTime
                ? this.#minTime < 60
                    ? this.#minTime
                    : 100
                : 0
        }%;"></div>`;
        result += "</div>";
        result += '<div class="time-value">';
        result += `${this.#timeFrom.value} `;

        if (this.#timeTo) {
            result += this.#timeFrom.unit !== ` ${this.#timeTo.unit}` ? this.#timeFrom.unit : "";
            result += " - ";
            result += `${this.#timeTo.value} ${this.#timeTo.unit}`;
        } else {
            result += this.#timeFrom.unit;
        }

        result += "</div>";
        result += "</div>";

        return result;
    }
}

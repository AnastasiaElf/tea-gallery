export class TimeBar {
    #minTime;
    #maxTime;
    #timeFrom;
    #timeTo;

    constructor(time) {
        if (!time) {
            throw Error("Constructor param time is missing");
        }

        const timeArray = time.split("-").map((elem) => parseInt(elem));
        this.#minTime = timeArray[0];
        this.#maxTime = timeArray[1];

        if (this.#maxTime) {
            if (this.#maxTime >= 60) {
                const minutesTo =
                    this.#maxTime % 60 === 0 ? (this.#maxTime / 60).toFixed(0) : (this.#maxTime / 60).toFixed(1);
                this.#timeTo = { value: minutesTo, unit: "min" };
            } else {
                this.#timeTo = { value: this.#maxTime, unit: "sec" };
            }
        }

        if (this.#minTime >= 60) {
            const minutesFrom =
                this.#minTime % 60 === 0 ? (this.#minTime / 60).toFixed(0) : (this.#minTime / 60).toFixed(1);
            this.#timeFrom = { value: minutesFrom, unit: "min" };
        } else {
            this.#timeFrom = { value: this.#minTime, unit: "sec" };
        }
    }

    renderToString() {
        return `<div class="tg-progress-bar-container">
            <div class="tg-progress-bar">
                <div class="tg-progress-bar-overlap" style="width: ${this.#getBarWidth()}%;"></div>
            </div>
            <div class="tg-progress-bar-value">
                ${this.#getBarLabel()}
            </div>
        </div>
        `;
    }

    #getBarLabel() {
        const labelFrom = `${this.#timeFrom.value} ${this.#timeFrom.unit}`;

        if (!this.#timeTo) {
            return labelFrom;
        }

        const labelTo = `${this.#timeTo.value} ${this.#timeTo.unit}`;

        if (this.#timeFrom.unit !== this.#timeTo.unit) {
            return `${labelFrom} - ${labelTo}`;
        } else {
            return `${this.#timeFrom.value} - ${labelTo}`;
        }
    }

    #getBarWidth() {
        const maxTime = 60;
        const maxWidth = 100;
        const time = this.#maxTime || this.#minTime;
        const currentWidth = (time * 100) / maxTime;

        return Math.min(currentWidth, maxWidth);
    }
}

import { TEA_GROUPS } from "./../constants.js";

const DOM_ELEMENT_ID = {
    PIE_CHART_STOCK: "pie-chart-stock",
    PIE_CHART_ALL: "pie-chart-all",
    BAR_CHART_ALL: "bar-chart-all",
    PIE_CHART_IN_STOCK: "pie-chart-in-stock",
    BAR_CHART_IN_STOCK: "bar-chart-in-stock",
    PIE_CHART_OUT_OF_STOCK: "pie-chart-out-of-stock",
    BAR_CHART_OUT_OF_STOCK: "bar-chart-out-of-stock",
};

export class Statistics {
    #container;
    #data;
    #domElem;

    constructor(container, data) {
        if (!data) {
            throw Error("Constructor param data is missing");
        }

        if (!container) {
            throw Error("Constructor param container is missing");
        }

        this.#data = data;
        this.#container = container;
    }

    render() {
        this.#domElem = document.createElement("div");
        this.#domElem.classList.add("tg-statistics");

        this.#domElem.innerHTML = `<div class="tg-statistics-row">
            <div id="${DOM_ELEMENT_ID.PIE_CHART_STOCK}" class="tg-chart"></div>
        </div>
        <div class="tg-statistics-row">
            <div id="${DOM_ELEMENT_ID.PIE_CHART_ALL}" class="tg-chart"></div>
            <div id="${DOM_ELEMENT_ID.BAR_CHART_ALL}" class="tg-chart"></div>
            <div id="${DOM_ELEMENT_ID.PIE_CHART_IN_STOCK}" class="tg-chart"></div>
            <div id="${DOM_ELEMENT_ID.BAR_CHART_IN_STOCK}" class="tg-chart"></div>
            <div id="${DOM_ELEMENT_ID.PIE_CHART_OUT_OF_STOCK}" class="tg-chart"></div>
            <div id="${DOM_ELEMENT_ID.BAR_CHART_OUT_OF_STOCK}" class="tg-chart"></div>
        </div>`;

        this.#container.appendChild(this.#domElem);
        this.#renderStockPieChart();
        this.#renderPieChart(DOM_ELEMENT_ID.PIE_CHART_ALL, "All teas", "total");
        this.#renderBarChart(DOM_ELEMENT_ID.BAR_CHART_ALL, "All teas", "total");
        this.#renderPieChart(DOM_ELEMENT_ID.PIE_CHART_IN_STOCK, "In stock", "inStock");
        this.#renderBarChart(DOM_ELEMENT_ID.BAR_CHART_IN_STOCK, "In stock", "inStock");
        this.#renderPieChart(DOM_ELEMENT_ID.PIE_CHART_OUT_OF_STOCK, "Out of stock", "outOfStock");
        this.#renderBarChart(DOM_ELEMENT_ID.BAR_CHART_OUT_OF_STOCK, "Out of stock", "outOfStock");
    }

    #renderStockPieChart() {
        const options = {
            title: {
                text: "All teas",
                align: "center",
                style: {
                    fontWeight: "500",
                },
            },
            colors: ["#009245", "#cccccc"],
            series: [
                this.#data.reduce((sum, group) => sum + group.stats.inStock, 0),
                this.#data.reduce((sum, group) => sum + group.stats.outOfStock, 0),
            ],
            chart: {
                width: "100%",
                type: "pie",
                animations: {
                    enabled: false,
                },
            },
            labels: ["In stock", "Out of stock"],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: "bottom",
                        },
                    },
                },
            ],
        };
        const stockPieChart = new ApexCharts(document.querySelector("#" + DOM_ELEMENT_ID.PIE_CHART_STOCK), options);
        stockPieChart.render();
    }

    #renderPieChart(containerId, label, statType) {
        const options = {
            title: {
                text: label,
                align: "center",
                style: {
                    fontWeight: "500",
                },
            },
            colors: this.#data.map((group) => TEA_GROUPS[group.id].color),
            series: this.#data.map((group) => group.stats[statType]),
            chart: {
                width: "100%",
                type: "pie",
                animations: { enabled: false },
            },
            labels: this.#data.map((group) => TEA_GROUPS[group.id].label),
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: "bottom",
                        },
                    },
                },
            ],
        };
        const allPieChart = new ApexCharts(document.querySelector("#" + containerId), options);
        allPieChart.render();
    }

    #renderBarChart(containerId, label, statType) {
        const options = {
            title: {
                text: label,
                align: "center",
                style: {
                    fontWeight: "500",
                },
            },
            colors: this.#data.map((group) => TEA_GROUPS[group.id].color),
            series: [{ data: this.#data.map((group) => group.stats[statType]), name: "Amount" }],
            chart: {
                width: "100%",
                type: "bar",
                toolbar: {
                    show: false,
                },
                animations: { enabled: false },
            },
            labels: this.#data.map((group) => TEA_GROUPS[group.id].label),
            plotOptions: {
                bar: {
                    distributed: true,
                },
            },
            legend: {
                show: false,
            },
        };
        const allBarChart = new ApexCharts(document.querySelector("#" + containerId), options);
        allBarChart.render();
    }
}

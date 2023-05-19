import { DOM_ELEMENT_ID, TEA_GROUP_COLOR } from "./../constants.js";

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
        this.#domElem.classList.add("tea-statistics-container");

        let content = '<div class="tea-statistics-info-container">';
        content += `<div id="${DOM_ELEMENT_ID.PIE_CHART_STOCK}" class="chart-container"></div>`;
        content += "</div>";
        content += '<div class="tea-statistics-info-container">';
        content += `<div id="${DOM_ELEMENT_ID.PIE_CHART_ALL}" class="chart-container"></div>`;
        content += `<div id="${DOM_ELEMENT_ID.BAR_CHART_ALL}" class="chart-container"></div>`;
        content += `<div id="${DOM_ELEMENT_ID.PIE_CHART_IN_STOCK}" class="chart-container"></div>`;
        content += `<div id="${DOM_ELEMENT_ID.BAR_CHART_IN_STOCK}" class="chart-container"></div>`;
        content += `<div id="${DOM_ELEMENT_ID.PIE_CHART_OUT_OF_STOCK}" class="chart-container"></div>`;
        content += `<div id="${DOM_ELEMENT_ID.BAR_CHART_OUT_OF_STOCK}" class="chart-container"></div>`;
        content += "</div>";

        this.#domElem.innerHTML = content;
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
            colors: this.#data.map((group) => TEA_GROUP_COLOR[group.name]),
            series: this.#data.map((group) => group.stats[statType]),
            chart: {
                width: "100%",
                type: "pie",
                animations: { enabled: false },
            },
            labels: this.#data.map((group) => group.name),
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
            colors: this.#data.map((group) => TEA_GROUP_COLOR[group.name]),
            series: [{ data: this.#data.map((group) => group.stats[statType]), name: "Amount" }],
            chart: {
                width: "100%",
                type: "bar",
                toolbar: {
                    show: false,
                },
                animations: { enabled: false },
            },
            labels: this.#data.map((group) => group.name),
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

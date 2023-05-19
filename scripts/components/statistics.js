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
        this.#renderAllPieChart();
        this.#renderAllBarChart();
        this.#renderInStockPieChart();
        this.#renderInStockBarChart();
        this.#renderOutOfStockPieChart();
        this.#renderOutOfStockBarChart();
    }

    #renderStockPieChart() {
        const stockPieChartOptions = {
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
        const stockPieChart = new ApexCharts(document.querySelector("#pie-chart-stock"), stockPieChartOptions);
        stockPieChart.render();
    }

    #renderAllPieChart() {
        const allPieChartOptions = {
            title: {
                text: "All teas",
                align: "center",
                style: {
                    fontWeight: "500",
                },
            },
            colors: this.#data.map((group) => TEA_GROUP_COLOR[group.name]),
            series: this.#data.map((group) => group.stats.total),
            chart: {
                width: "100%",
                type: "pie",
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
        const allPieChart = new ApexCharts(document.querySelector("#pie-chart-all"), allPieChartOptions);
        allPieChart.render();
    }

    #renderAllBarChart() {
        const allBarChartOptions = {
            title: {
                text: "All teas",
                align: "center",
                style: {
                    fontWeight: "500",
                },
            },
            colors: this.#data.map((group) => TEA_GROUP_COLOR[group.name]),
            series: [{ data: this.#data.map((group) => group.stats.total), name: "Amount" }],
            chart: {
                width: "100%",
                type: "bar",
                toolbar: {
                    show: false,
                },
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
        const allBarChart = new ApexCharts(document.querySelector("#bar-chart-all"), allBarChartOptions);
        allBarChart.render();
    }

    #renderInStockPieChart() {
        const inStockPieChartOptions = {
            title: {
                text: "In stock",
                align: "center",
                style: {
                    fontWeight: "500",
                },
            },
            colors: this.#data.map((group) => TEA_GROUP_COLOR[group.name]),
            series: this.#data.map((group) => group.stats.inStock),
            chart: {
                width: "100%",
                type: "pie",
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
        const inStockPieChart = new ApexCharts(document.querySelector("#pie-chart-in-stock"), inStockPieChartOptions);
        inStockPieChart.render();
    }

    #renderInStockBarChart() {
        const inStockBarChartOptions = {
            title: {
                text: "In stock",
                align: "center",
                style: {
                    fontWeight: "500",
                },
            },
            colors: this.#data.map((group) => TEA_GROUP_COLOR[group.name]),
            series: [{ data: this.#data.map((group) => group.stats.inStock), name: "Amount" }],
            chart: {
                width: "100%",
                type: "bar",
                toolbar: {
                    show: false,
                },
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
        const inStockBarChart = new ApexCharts(document.querySelector("#bar-chart-in-stock"), inStockBarChartOptions);
        inStockBarChart.render();
    }

    #renderOutOfStockPieChart() {
        const outOfStockPieChartOptions = {
            title: {
                text: "Out of stock",
                align: "center",
                style: {
                    fontWeight: "500",
                },
            },
            colors: this.#data.map((group) => TEA_GROUP_COLOR[group.name]),
            series: this.#data.map((group) => group.stats.outOfStock),
            chart: {
                width: "100%",
                type: "pie",
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
        const outOfStockPieChart = new ApexCharts(
            document.querySelector("#pie-chart-out-of-stock"),
            outOfStockPieChartOptions
        );
        outOfStockPieChart.render();
    }

    #renderOutOfStockBarChart() {
        const outOfStockBarChartOptions = {
            title: {
                text: "Out of stock",
                align: "center",
                style: {
                    fontWeight: "500",
                },
            },
            colors: this.#data.map((group) => TEA_GROUP_COLOR[group.name]),
            series: [{ data: this.#data.map((group) => group.stats.outOfStock), name: "Amount" }],
            chart: {
                width: "100%",
                type: "bar",
                toolbar: {
                    show: false,
                },
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
        const outOfStockBarChart = new ApexCharts(
            document.querySelector("#bar-chart-out-of-stock"),
            outOfStockBarChartOptions
        );
        outOfStockBarChart.render();
    }
}

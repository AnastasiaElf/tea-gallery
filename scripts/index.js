import { TeaGallery } from "./components/teaGallery.js";

const RAW_DATA_KEY = {
    group: "Group",
    name: "Name",
    brewingTime: "Brewing time",
    temperature: "Water temperature",
    tableware: "Tableware",
    rating: "Rating",
    review: "Review",
    price: "Price for 50g",
    tags: "Tags",
    inStock: "In Stock",
};

function fetchData(url) {
    return new Promise((resolve, reject) => {
        Papa.parse(url, {
            download: true,
            header: true,
            complete(results) {
                resolve(results.data);
            },
            error(err) {
                reject(err);
            },
        });
    });
}

const dataUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQpTjrajTJBBVhh--4YMoEigqzpbGXiuz6zvIdgh6YAGnzkVhPyZ4piynKA8GuZ-dIvWqFNZRKvRLux/pub?gid=262473402&single=true&output=csv";

fetchData(dataUrl)
    .then((data) => {
        const container = document.getElementById("root");

        const updatedData = data.map((rawItem, index) => {
            let item = {};
            Object.entries(RAW_DATA_KEY).forEach(([key, rawKey]) => {
                item[key] = rawItem[rawKey];
            });

            return {
                ...item,
                id: "tea-" + index,
                tags: item.tags
                    .split(",")
                    .map((elem) => elem.trim())
                    .filter((elem) => elem !== "")
                    .sort(),
                inStock: JSON.parse(item.inStock.toLowerCase()),
            };
        });

        const teaGallery = new TeaGallery(container, updatedData);
        teaGallery.render();
    })
    .catch((error) => {
        console.error(error);
    });

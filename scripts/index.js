import { TeaGallery } from "./components/teaGallery.js";
import { DATA_KEY } from "./constants.js";

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
        const updatedData = data.map((item, index) => ({
            ...item,
            id: "tea-" + index,
            [DATA_KEY.TAGS]: item[DATA_KEY.TAGS]
                .split(",")
                .map((elem) => elem.trim())
                .filter((elem) => elem !== "")
                .sort(),
            [DATA_KEY.IN_STOCK]: JSON.parse(item[DATA_KEY.IN_STOCK].toLowerCase()),
        }));

        const teaGallery = new TeaGallery(container, updatedData);
        teaGallery.render();
    })
    .catch((error) => {
        console.error(error);
    });

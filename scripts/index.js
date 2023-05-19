import { TeaGallery } from "./components/teaGallery.js";

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
        const teaGallery = new TeaGallery(container, data);
        teaGallery.render();
    })
    .catch((error) => {
        console.error(error);
    });

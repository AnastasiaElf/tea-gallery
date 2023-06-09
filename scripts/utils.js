export function stringToArray(arr) {
    return arr
        .split(",")
        .map((elem) => elem.trim())
        .filter((elem) => elem !== "")
        .sort();
}

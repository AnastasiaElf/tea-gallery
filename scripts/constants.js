export const CATEGORIES_MAP = {
    GREEN: "Зеленый",
    RED: "Красный",
    WHITE: "Белый",
    JAPANESE: "Японский",
    SHU: "Шу",
    SHEN: "Шен",
    OOLONG: "Улун",
    OTHERS: "НеЧай",
    MATI: "Мате",
    BLACK: "Черный",
}

export const CATEGORIES_CLASSNAMES_MAP = {
    [CATEGORIES_MAP.GREEN]: "green",
    [CATEGORIES_MAP.RED]: "red",
    [CATEGORIES_MAP.WHITE]: "white",
    [CATEGORIES_MAP.JAPANESE]: "japanese",
    [CATEGORIES_MAP.SHU]: "shu",
    [CATEGORIES_MAP.SHEN]: "shen",
    [CATEGORIES_MAP.OOLONG]: "oolong",
    [CATEGORIES_MAP.OTHERS]: "others",
    [CATEGORIES_MAP.MATI]: "mati",
    [CATEGORIES_MAP.BLACK]: "black",
}

export const CATEGORIES_COLOR = {
    [CATEGORIES_MAP.GREEN]: "#009245",
    [CATEGORIES_MAP.RED]: "#e0421b",
    [CATEGORIES_MAP.WHITE]: "#cccccc",
    [CATEGORIES_MAP.JAPANESE]: "#709200",
    [CATEGORIES_MAP.SHU]: "#925c00",
    [CATEGORIES_MAP.SHEN]: "#436b26",
    [CATEGORIES_MAP.OOLONG]: "#00b3ad",
    [CATEGORIES_MAP.OTHERS]: "#80559c",
    [CATEGORIES_MAP.MATI]: "#93e22b",
    [CATEGORIES_MAP.BLACK]: "#131313",
}

export const KEYS_MAP = {
    CATEGORY: "Вид",
    NAME: "Название",
    BREWING_TIME: "Время заваривания",
    TEMPERATURE: "Температура воды",
    TABLEWARE: "Посуда",
    RATING: "Оценка",
    REVIEW: "Отзыв",
    COST: "Цена за 50г",
    TAGS: "Теги",
    IN_STOCK: "В наличии"
}

export const TABLEWARE = {
    CLAY: "Глина",
    PORCELAIN: "Фарфор",
    GLASS: "Стекло",
    TEAPOT: "Заварник",
    THERMOS: "Термос"
}

export const TAGS = {
    MORNING: "Утренний",
    EVENING: "Вечерний",
    SPECIAL: "Особый"
}

export const ELEMENT_ID = {
    CATEGORIES: "categories",
    SEARCH_INPUT: "search_input",
    SEARCH_BUTTON: "search_button",
    SEARCH_CLEAR_BUTTON: "search_clear_button",
    TAGS: "tags",
    RANDOMIZER_TOGGLER: "randomizer_toggler",
    RANDOMIZER_SUBMIT: "randomizer_submit",
    STOCK_TYPE: "stock_type",
    STATISTICS_TOGGLER: "statistics_toggler",
}

export const STOCK_TYPE = {
    ALL: "ALL",
    IN_STOCK: "IN_STOCK",
    OUT_OF_STOCK: "OUT_OF_STOCK"
}
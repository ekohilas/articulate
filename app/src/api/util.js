export function random_choice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function wild_category(Category) {
    const keys = Object.keys(Category);
    keys.splice(Category.WILD, 1);
    return Category[random_choice(keys)];
};

export function choice_from_set(set) {
    return random_choice(Array.from(set));
};

export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export function map_to_object(map) {
    const obj = {};
    for (const [key, value] of map) {
        obj[key] = value;
    }
    return obj;
};

export function create_table(rows, columns) {
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < columns; j++) {
            const td = document.createElement('td');
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    return table;
}

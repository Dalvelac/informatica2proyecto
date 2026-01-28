// utils.js
// Cositas pequeñas que se usan en varios sitios, para no repetir código.

export function generateId() {
    // Id simple: timestamp + random. Suficiente para práctica.
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export function escapeHTML(str) {
    // Para evitar que alguien meta HTML raro en el nombre y rompa el DOM.
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

export function debounce(fn, wait = 200) {
    let t = null;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), wait);
    };
}

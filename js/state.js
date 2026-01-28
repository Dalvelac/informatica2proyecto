// el array de clientes.
// La idea es que el DOM no sea la fuente de la verdad, sino este array.

const state = {
    clientes: [],
};

const STORAGE_KEY = "clientes_dom_app";
const SEEDED_KEY = "clientes_dom_app__seeded_v1";

function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.clientes));
}

function load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
        const parsed = JSON.parse(raw);
        // Esperamos un array; si no, lo ignoramos.
        if (Array.isArray(parsed)) state.clientes = parsed;
    } catch {
        // Si el JSON está corrupto, lo limpiamos para que la app no reviente.
        localStorage.removeItem(STORAGE_KEY);
    }
}

function seedIfEmpty() {
    // Seed una sola vez por navegador.
    // Y, si por lo que sea se ha duplicado el seed, lo dejamos en exactamente 3.
    const seeded = localStorage.getItem(SEEDED_KEY) === "1";
    if (seeded) return;

    state.clientes = [
        {
            id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            nombre: "Ana López",
            email: "ana@mail.com",
            telefono: "600123123",
        },
        {
            id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            nombre: "Carlos Ruiz",
            email: "carlos@mail.com",
            telefono: "611222333",
        },
        {
            id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            nombre: "Lucía Martín",
            email: "lucia@mail.com",
            telefono: "622333444",
        },
    ];

    save();
    localStorage.setItem(SEEDED_KEY, "1");
}

load();
seedIfEmpty();

export function getClientes() {
    return state.clientes;
}

export function addCliente(cliente) {
    state.clientes.push(cliente);
    save();
}

export function updateCliente(id, data) {
    const idx = state.clientes.findIndex(c => c.id === id);
    if (idx === -1) return false;
    state.clientes[idx] = { ...state.clientes[idx], ...data };
    save();
    return true;
}

export function removeCliente(id) {
    const before = state.clientes.length;
    state.clientes = state.clientes.filter(c => c.id !== id);
    save();
    return state.clientes.length !== before;
}

export function findClienteById(id) {
    return state.clientes.find(c => c.id === id) ?? null;
}

export function emailExists(email, ignoreId = null) {
    const e = String(email).trim().toLowerCase();
    return state.clientes.some(c => c.email.toLowerCase() === e && c.id !== ignoreId);
}

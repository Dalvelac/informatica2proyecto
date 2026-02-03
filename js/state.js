// el array de clientes.
// La idea es que el DOM no sea la fuente de la verdad, sino este array.

const state = {
    clientes: [],
};

const STORAGE_KEY = "clientes_dom_app";
const SEEDED_KEY = "clientes_dom_app__seeded_v1";

const SEED_CLIENTES = [
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

const SEED_EMAILS = new Set(SEED_CLIENTES.map(c => c.email.toLowerCase()));

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
    // Si ya hay datos, no seeding. Evita duplicados en recargas.
    if (state.clientes.length > 0) return;

    // Seed una sola vez por navegador.
    const seeded = localStorage.getItem(SEEDED_KEY) === "1";
    if (seeded) return;

    state.clientes = [...SEED_CLIENTES];

    save();
    localStorage.setItem(SEEDED_KEY, "1");
}

function dedupeSeedClients() {
    // Limpia duplicados de los 3 ejemplos si ya existen por recargas previas.
    if (state.clientes.length === 0) return;

    const seen = new Set();
    const next = [];

    for (const c of state.clientes) {
        const email = String(c.email ?? "").toLowerCase();
        if (!SEED_EMAILS.has(email)) {
            next.push(c);
            continue;
        }
        if (seen.has(email)) continue;
        seen.add(email);
        next.push(c);
    }

    if (next.length !== state.clientes.length) {
        state.clientes = next;
        save();
    }
}

load();
dedupeSeedClients();
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

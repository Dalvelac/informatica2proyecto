// el array de clientes.
// La idea es que el DOM no sea la fuente de la verdad, sino este array.

const state = {
    clientes: [],
};

export function getClientes() {
    return state.clientes;
}

export function addCliente(cliente) {
    state.clientes.push(cliente);
}

export function updateCliente(id, data) {
    const idx = state.clientes.findIndex(c => c.id === id);
    if (idx === -1) return false;

    state.clientes[idx] = { ...state.clientes[idx], ...data };
    return true;
}

export function removeCliente(id) {
    const before = state.clientes.length;
    state.clientes = state.clientes.filter(c => c.id !== id);
    return state.clientes.length !== before;
}

export function findClienteById(id) {
    return state.clientes.find(c => c.id === id) ?? null;
}

export function emailExists(email, ignoreId = null) {
    const e = String(email).trim().toLowerCase();
    return state.clientes.some(c => c.email.toLowerCase() === e && c.id !== ignoreId);
}

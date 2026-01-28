// validators.js
// Validaciones de campos (las típicas) + email único.

import { emailExists } from "./state.js";

export function isRequired(value) {
    return String(value ?? "").trim().length > 0;
}

export function isEmail(value) {
    const v = String(value ?? "").trim().toLowerCase();
    // Regex simple (para práctica vale)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function isPhone(value) {
    // Aceptamos 9-15 dígitos (España y general). Quitamos espacios y guiones.
    const v = String(value ?? "").replace(/[^\d]/g, "");
    return v.length >= 9 && v.length <= 15;
}

export function validateCliente(payload, mode = "create") {
    // mode: create | edit
    // payload: { nombre, email, telefono, id? }

    const errors = {};

    if (!isRequired(payload.nombre)) {
        errors.nombre = "El nombre es obligatorio.";
    }

    if (!isRequired(payload.email)) {
        errors.email = "El email es obligatorio.";
    } else if (!isEmail(payload.email)) {
        errors.email = "El email no tiene formato válido.";
    } else {
        const ignoreId = mode === "edit" ? payload.id : null;
        if (emailExists(payload.email, ignoreId)) {
            errors.email = "Ese email ya existe (tiene que ser único).";
        }
    }

    if (!isRequired(payload.telefono)) {
        errors.telefono = "El teléfono es obligatorio.";
    } else if (!isPhone(payload.telefono)) {
        errors.telefono = "Teléfono inválido (usa dígitos, 9-15).";
    }

    return {
        ok: Object.keys(errors).length === 0,
        errors,
    };
}

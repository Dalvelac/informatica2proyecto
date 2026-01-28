// wiring

import { setupEvents } from "./events.js";
import { addCliente } from "./state.js";
import { generateId } from "./utils.js";

// Alta
const formAlta = document.getElementById("form-alta");
const inputNombre = document.getElementById("nombre");
const inputEmail = document.getElementById("email");
const inputTelefono = document.getElementById("telefono");

// Tabla
const tbody = document.getElementById("tbody-clientes");
const emptyEl = document.getElementById("estado-vacio");
const buscador = document.getElementById("buscador");

// Toast
const toast = document.getElementById("toast");

// Sort
const thSortBtns = Array.from(document.querySelectorAll(".th-btn[data-sort]"));
const sortNombreIndicator = document.getElementById("sort-nombre");
const sortEmailIndicator = document.getElementById("sort-email");

// Modal
const modalDialog = document.getElementById("modal-editar");
const backdrop = document.getElementById("modal-backdrop");
const btnCerrarModal = document.getElementById("btn-cerrar-modal");
const btnCancelar = document.getElementById("btn-cancelar");
const formEditar = document.getElementById("form-editar");

// Campos modal
const editFields = {
    idEl: document.getElementById("edit-id"),
    nombreEl: document.getElementById("edit-nombre"),
    emailEl: document.getElementById("edit-email"),
    telEl: document.getElementById("edit-telefono"),
};

// Errores alta
const altaErrors = {
    nombre: {
        inputEl: inputNombre,
        errorEl: document.querySelector('[data-error-for="nombre"]'),
    },
    email: {
        inputEl: inputEmail,
        errorEl: document.querySelector('[data-error-for="email"]'),
    },
    telefono: {
        inputEl: inputTelefono,
        errorEl: document.querySelector('[data-error-for="telefono"]'),
    },
};

// Errores modal
const editErrors = {
    nombre: {
        inputEl: editFields.nombreEl,
        errorEl: document.querySelector('[data-error-for="edit-nombre"]'),
    },
    email: {
        inputEl: editFields.emailEl,
        errorEl: document.querySelector('[data-error-for="edit-email"]'),
    },
    telefono: {
        inputEl: editFields.telEl,
        errorEl: document.querySelector('[data-error-for="edit-telefono"]'),
    },
};

addCliente({
    id: generateId(),
    nombre: "Ana López",
    email: "ana@mail.com",
    telefono: "600123123"
});

addCliente({
    id: generateId(),
    nombre: "Carlos Ruiz",
    email: "carlos@mail.com",
    telefono: "611222333"
});

addCliente({
    id: generateId(),
    nombre: "Lucía Martín",
    email: "lucia@mail.com",
    telefono: "622333444"
});

// Arrancamos app
setupEvents({
    formAlta,
    inputNombre,
    inputEmail,
    inputTelefono,
    altaErrors,

    tbody,
    emptyEl,
    buscador,

    toast,

    thSortBtns,
    sortNombreIndicator,
    sortEmailIndicator,

    modalDialog,
    backdrop,
    btnCerrarModal,
    btnCancelar,
    formEditar,
    editFields,
    editErrors,
});

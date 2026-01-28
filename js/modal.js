// controla el modal (abrir, cerrar, foco, etc.)

export function openModal({ dialog, backdrop, onOpenFocusEl }) {
    backdrop.classList.remove("hidden");

    // showModal() abre el <dialog> de verdad (si el navegador soporta)
    if (typeof dialog.showModal === "function") {
        dialog.showModal();
    } else {
        // fallback muy básico
        dialog.setAttribute("open", "");
    }

    // Enfocamos algo para UX
    if (onOpenFocusEl) onOpenFocusEl.focus();
}

export function closeModal({ dialog, backdrop }) {
    backdrop.classList.add("hidden");

    if (typeof dialog.close === "function") {
        dialog.close();
    } else {
        dialog.removeAttribute("open");
    }
}

export function fillEditForm({ idEl, nombreEl, emailEl, telEl }, cliente) {
    idEl.value = cliente.id;
    nombreEl.value = cliente.nombre;
    emailEl.value = cliente.email;
    telEl.value = cliente.telefono;
}

export function getEditPayload({ idEl, nombreEl, emailEl, telEl }) {
    return {
        id: idEl.value,
        nombre: nombreEl.value,
        email: emailEl.value,
        telefono: telEl.value,
    };
}

import { generateId, debounce } from "./utils.js";
import { addCliente, getClientes, removeCliente, updateCliente, findClienteById } from "./state.js";
import { validateCliente } from "./validators.js";
import { renderTabla, setEmptyState, showToast, setFieldError, clearFormErrors, setSortIndicators } from "./dom.js";
import { openModal, closeModal, fillEditForm, getEditPayload } from "./modal.js";

export function setupEvents(deps) {
    const {
        // Alta
        formAlta,
        inputNombre,
        inputEmail,
        inputTelefono,
        altaErrors,

        // Tabla
        tbody,
        emptyEl,
        buscador,

        // Toast
        toast,

        // Sort
        thSortBtns,
        sortNombreIndicator,
        sortEmailIndicator,

        // Modal
        modalDialog,
        backdrop,
        btnCerrarModal,
        btnCancelar,
        formEditar,
        editFields,
        editErrors,
    } = deps;

    // Estado UI para buscar/ordenar
    let query = "";
    let sortBy = null; // "nombre" | "email" | null
    let sortDir = "asc"; // "asc" | "desc"

    const applyView = () => {
        // Cogemos clientes del estado y aplicamos filtros/orden
        let list = [...getClientes()];

        if (query.trim()) {
            const q = query.trim().toLowerCase();
            list = list.filter(c =>
                c.nombre.toLowerCase().includes(q) ||
                c.email.toLowerCase().includes(q)
            );
        }

        if (sortBy) {
            list.sort((a, b) => {
                const A = String(a[sortBy]).toLowerCase();
                const B = String(b[sortBy]).toLowerCase();
                if (A < B) return sortDir === "asc" ? -1 : 1;
                if (A > B) return sortDir === "asc" ? 1 : -1;
                return 0;
            });
        }

        renderTabla({ tbody, clientes: list });
        setEmptyState({ emptyEl, hasRows: list.length > 0 });
        setSortIndicators({
            sortBy,
            sortDir,
            nombreEl: sortNombreIndicator,
            emailEl: sortEmailIndicator,
        });
    };

    // Validación live básica en alta
    const validateAltaLive = () => {
        const payload = {
            nombre: inputNombre.value,
            email: inputEmail.value,
            telefono: inputTelefono.value,
        };

        const res = validateCliente(payload, "create");
        document.getElementById("btn-crear").disabled = !res.ok;

        // Pintamos errores campo a campo
        setFieldError(altaErrors.nombre.inputEl, altaErrors.nombre.errorEl, res.errors.nombre || "");
        setFieldError(altaErrors.email.inputEl, altaErrors.email.errorEl, res.errors.email || "");
        setFieldError(altaErrors.telefono.inputEl, altaErrors.telefono.errorEl, res.errors.telefono || "");

        return res.ok;
    };

    const validateEditLive = () => {
        const payload = getEditPayload(editFields);
        const res = validateCliente(payload, "edit");

        setFieldError(editErrors.nombre.inputEl, editErrors.nombre.errorEl, res.errors.nombre || "");
        setFieldError(editErrors.email.inputEl, editErrors.email.errorEl, res.errors.email || "");
        setFieldError(editErrors.telefono.inputEl, editErrors.telefono.errorEl, res.errors.telefono || "");

        return res.ok;
    };

    // Live validation con debounce para no spamear
    const altaLiveDebounced = debounce(validateAltaLive, 120);
    inputNombre.addEventListener("input", altaLiveDebounced);
    inputEmail.addEventListener("input", altaLiveDebounced);
    inputTelefono.addEventListener("input", altaLiveDebounced);

    // Submit alta
    formAlta.addEventListener("submit", (e) => {
        e.preventDefault();

        const payload = {
            nombre: inputNombre.value,
            email: inputEmail.value,
            telefono: inputTelefono.value,
        };

        const res = validateCliente(payload, "create");

        // Si hay errores, los pinto y ya
        setFieldError(altaErrors.nombre.inputEl, altaErrors.nombre.errorEl, res.errors.nombre || "");
        setFieldError(altaErrors.email.inputEl, altaErrors.email.errorEl, res.errors.email || "");
        setFieldError(altaErrors.telefono.inputEl, altaErrors.telefono.errorEl, res.errors.telefono || "");

        if (!res.ok) {
            showToast(toast, "Revisa los campos (hay errores).", "bad");
            return;
        }

        addCliente({
            id: generateId(),
            nombre: payload.nombre.trim(),
            email: payload.email.trim(),
            telefono: payload.telefono.trim(),
        });

        // Limpiamos form
        formAlta.reset();
        clearFormErrors(altaErrors);

        showToast(toast, "Cliente creado correctamente ✅", "ok");
        applyView();
    });

    // Buscador
    buscador.addEventListener("input", debounce((e) => {
        query = e.target.value ?? "";
        applyView();
    }, 120));

    // Ordenación (click en los "th-btn")
    thSortBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const key = btn.dataset.sort;

            if (sortBy === key) {
                // Si clicas otra vez, invierte dirección
                sortDir = sortDir === "asc" ? "desc" : "asc";
            } else {
                sortBy = key;
                sortDir = "asc";
            }

            applyView();
        });
    });

    // Clicks en acciones de la tabla (delegación de eventos)
    tbody.addEventListener("click", (e) => {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;

        const action = target.dataset.action;
        const id = target.dataset.id;
        if (!action || !id) return;

        if (action === "delete") {
            const ok = window.confirm("¿Seguro que quieres eliminar este cliente?");
            if (!ok) return;

            const removed = removeCliente(id);
            if (removed) showToast(toast, "Cliente eliminado 🗑️", "ok");
            else showToast(toast, "No se pudo eliminar (no encontrado).", "bad");

            applyView();
            return;
        }

        if (action === "edit") {
            const cliente = findClienteById(id);
            if (!cliente) {
                showToast(toast, "Cliente no encontrado.", "bad");
                return;
            }

            // Rellenamos modal
            fillEditForm(editFields, cliente);
            clearFormErrors(editErrors);

            openModal({
                dialog: modalDialog,
                backdrop,
                onOpenFocusEl: editFields.nombreEl,
            });
        }
    });

    // Modal: cerrar
    btnCerrarModal.addEventListener("click", () => closeModal({ dialog: modalDialog, backdrop }));
    btnCancelar.addEventListener("click", () => closeModal({ dialog: modalDialog, backdrop }));

    // Click fuera del modal (backdrop)
    backdrop.addEventListener("click", () => closeModal({ dialog: modalDialog, backdrop }));

    // ESC (por accesibilidad)
    modalDialog.addEventListener("cancel", (e) => {
        e.preventDefault(); // para controlar nosotros el cierre y backdrop
        closeModal({ dialog: modalDialog, backdrop });
    });

    // Live validation edición
    editFields.nombreEl.addEventListener("input", debounce(validateEditLive, 120));
    editFields.emailEl.addEventListener("input", debounce(validateEditLive, 120));
    editFields.telEl.addEventListener("input", debounce(validateEditLive, 120));

    // Guardar cambios
    formEditar.addEventListener("submit", (e) => {
        e.preventDefault();

        const payload = getEditPayload(editFields);
        const res = validateCliente(payload, "edit");

        setFieldError(editErrors.nombre.inputEl, editErrors.nombre.errorEl, res.errors.nombre || "");
        setFieldError(editErrors.email.inputEl, editErrors.email.errorEl, res.errors.email || "");
        setFieldError(editErrors.telefono.inputEl, editErrors.telefono.errorEl, res.errors.telefono || "");

        if (!res.ok) {
            showToast(toast, "Revisa los campos del modal.", "bad");
            return;
        }

        const updated = updateCliente(payload.id, {
            nombre: payload.nombre.trim(),
            email: payload.email.trim(),
            telefono: payload.telefono.trim(),
        });

        if (!updated) {
            showToast(toast, "No se pudo actualizar (no encontrado).", "bad");
            return;
        }

        closeModal({ dialog: modalDialog, backdrop });
        showToast(toast, "Cliente actualizado ✍️", "ok");
        applyView();
    });

    // Estado inicial del botón (sin mostrar errores todavía)
    const btnCrear = document.getElementById("btn-crear");
    if (btnCrear) btnCrear.disabled = true;

    // Render inicial
    applyView();
}

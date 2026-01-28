import { escapeHTML } from "./utils.js";

export function renderTabla({ tbody, clientes }) {
    // Limpiamos y volvemos a dibujar
    tbody.innerHTML = "";

    for (const c of clientes) {
        const tr = document.createElement("tr");

        tr.innerHTML = `
      <td>${escapeHTML(c.id)}</td>
      <td>${escapeHTML(c.nombre)}</td>
      <td>${escapeHTML(c.email)}</td>
      <td>${escapeHTML(c.telefono)}</td>
      <td>
        <div class="actions">
          <button class="btn-small" data-action="edit" data-id="${escapeHTML(c.id)}">Editar</button>
          <button class="btn-small btn-danger" data-action="delete" data-id="${escapeHTML(c.id)}">Eliminar</button>
        </div>
      </td>
    `;

        tbody.appendChild(tr);
    }
}

export function setEmptyState({ emptyEl, hasRows }) {
    emptyEl.style.display = hasRows ? "none" : "block";
}

export function showToast(toastEl, msg, type = "ok") {
    toastEl.textContent = msg;
    toastEl.classList.remove("ok", "bad");
    toastEl.classList.add(type === "ok" ? "ok" : "bad");

    // Auto-limpieza rápida
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
        toastEl.textContent = "";
        toastEl.classList.remove("ok", "bad");
    }, 2200);
}

export function setFieldError(inputEl, errorEl, message = "") {
    if (!inputEl || !errorEl) return;
    errorEl.textContent = message;

    if (message) inputEl.classList.add("invalid");
    else inputEl.classList.remove("invalid");
}

export function clearFormErrors(map) {
    // map: { inputEl, errorEl }...
    for (const key of Object.keys(map)) {
        setFieldError(map[key].inputEl, map[key].errorEl, "");
    }
}

export function setSortIndicators({ sortBy, sortDir, nombreEl, emailEl }) {
    // Cosita visual para que se vea qué se está ordenando
    nombreEl.textContent = "";
    emailEl.textContent = "";

    const arrow = sortDir === "asc" ? "↑" : "↓";
    if (sortBy === "nombre") nombreEl.textContent = arrow;
    if (sortBy === "email") emailEl.textContent = arrow;
}

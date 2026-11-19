// Genera el HTML de un modal con Bootstrap.
export function modalTemplate({ id, title, body, contentClass = '' }) {
    return `
        <div class="modal fade" id="${id}" tabindex="-1" aria-labelledby="${id}_title" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content bg-dark ${contentClass}">
                    <div class="modal-header border-0 px-4 pb-0">
                        <h1 class="modal-title fs-3" id="${id}_title">${title}</h1>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        ${body}
                    </div>
                </div>
            </div>
        </div>`
}

export function openModal(modalElement) {
    bootstrap.Modal.getOrCreateInstance(modalElement).show()
}

export function closeModal(modalElement) {
    bootstrap.Modal.getOrCreateInstance(modalElement).hide()
}

// Maneja el modal al termina de abrirse.
export function onModalShown(modalElement, handler) {
    modalElement.addEventListener('shown.bs.modal', handler)
}

// Maneja el modal al terminar de cerrarse.
export function onModalHidden(modalElement, handler) {
    modalElement.addEventListener('hidden.bs.modal', handler)
}

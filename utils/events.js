// Diccionario y control de eventos.

export const EVENTS = {
    // Para la UI.
    OPEN_NEW_TASK: 'ui:open-new-task',
    OPEN_TASK_DETAIL: 'ui:open-task-detail',
    OPEN_EXCUSE: 'ui:open-excuse',
    // Para cambios en la tarea.
    TASK_CREATED: 'task:created',
    TASK_UPDATED: 'task:updated',
    // Tarea eliminada con excusa (detail: la excusa creada).
    TASK_DELETED: 'task:deleted',
}

// Evento con datos opcionales.
export function emit(name, detail = null) {
    document.dispatchEvent(new CustomEvent(name, { detail }))
}

// Escucha un evento y retorna funcion para eliminar el listener.
export function on(name, handler) {
    const listener = (e) => handler(e.detail, e)
    document.addEventListener(name, listener)
    return () => document.removeEventListener(name, listener)
}

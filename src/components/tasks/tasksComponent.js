import { tasksController } from "./tasksController.js";
import { EVENTS, emit, on } from "../../utils/events.js";

// Componente <tasks>
class Tasks extends HTMLElement {

    connectedCallback() {
        this.innerHTML = `
            <article class="d-flex p-4 align-items-center flex-column gap-4 w-100">
                <button type="button" class="btn btn-secondary btn-lg" data-new-task>Agrega la tarea que debes finalizar ¡HOY!</button>
                <div class="row g-3 w-100 align-items-stretch justify-content-center gap-2">

                    <div class="col-12 col-lg-4 order-2 order-lg-1 border rounded text-success inactive_tasks h-100">
                        <div class="d-flex flex-column h-100 p-3">
                            <div class="mb-4">
                                <h5 class="fw-bold" data-latest-title></h5>
                                <small>Tareas de ayer.</small>
                            </div>
                            <!-- tareas pasadas -->
                            <div data-latest-tasks></div>
                        </div>
                    </div>

                    <div class="col-12 col-lg-8 order-1 order-lg-2 border rounded active_tasks h-100">
                        <div class="d-flex flex-column h-100 p-3">
                            <div class="mb-4">
                                <h5 class="fw-bold" data-today-title></h5>
                                <small>Tareas activas para hoy.</small>
                            </div>
                            <!-- tareas actuales -->
                            <div class="d-flex flex-column gap-2 w-100" data-today-tasks></div>
                        </div>
                    </div>

                </div>
            </article>`

        this.render()

        // Pide abrir el formulario de nueva tarea.
        this.querySelector('[data-new-task]')
            .addEventListener('click', () => emit(EVENTS.OPEN_NEW_TASK))

        // Refresca la lista cuando se crea una tarea.
        this.offTaskCreated = on(EVENTS.TASK_CREATED, () => this.render())

        // Refresca la lista cuando cambia el estado de una tarea.
        this.offTaskUpdated = on(EVENTS.TASK_UPDATED, () => this.render())
    }

    disconnectedCallback() {
        this.offTaskCreated?.()
        this.offTaskUpdated?.()
    }

    render() {
        // Lee las tareas y vuelve a refrescar la lista de tareas.
        tasksController(this)
      
    }
}

customElements.define('tasks-actions', Tasks)

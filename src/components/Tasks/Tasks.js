import { renderTask } from "./renderTask.js";
import { getTasksLocalStorage } from "../../services/tasksInlocalStorage.js";
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

        // Pide abrir el formulario de nueva tarea (no sabe que componente lo atiende).
        this.querySelector('[data-new-task]')
            .addEventListener('click', () => emit(EVENTS.OPEN_NEW_TASK))

        // Refresca la lista cuando se crea una tarea.
        this.offTaskCreated = on(EVENTS.TASK_CREATED, () => this.render())
    }

    disconnectedCallback() {
        this.offTaskCreated?.()
    }

    // Lee las tareas y vuelve a refrescar la lista de tareas.
    render() {
        // Obtiene las tareas.
        const tasks = getTasksLocalStorage()

        // Titulos y containers (se buscan dentro del componente, no en todo el documento).
        const containerLatestTasks = this.querySelector('[data-latest-tasks]')
        const containerTodayTasks = this.querySelector('[data-today-tasks]')
        const titleLatestTasks = this.querySelector('[data-latest-title]')
        const titleTodayTasks = this.querySelector('[data-today-title]')

        // Define el dia y la hora actual.
        const actualDate = new Date()
        const yesterday = new Date(actualDate - 1 * 24 * 60 * 60 * 1000)

        // Define los titulos.
        titleLatestTasks.innerText =
            `${yesterday.toLocaleString('es-ES', { day: 'numeric', month: 'long' })}`

        titleTodayTasks.innerText =
            `${actualDate.toLocaleString('es-ES', { day: 'numeric', month: 'long' })}`

        // tareas de ayer.
        const latestTasks = tasks.filter(task => task.createdAt.getDate() < actualDate.getDate())
        renderTask(latestTasks, containerLatestTasks)

        // tareas de hoy.
        const todayTasks = tasks.filter(task => task.createdAt.getDate() === actualDate.getDate())
        renderTask(todayTasks, containerTodayTasks)
    }
}

customElements.define('tasks-actions', Tasks)

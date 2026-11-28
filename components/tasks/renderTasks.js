import { badgeStatusColor, priorityColor } from "../../utils/tasksDataDecorators.js";
import { updateTaskLocalStorage } from "../../services/tasksInlocalStorage.js";
import { EVENTS, emit } from "../../utils/events.js";
import { Excuse } from "../../models/Excuse.js";

// Formato de hora (ej: 03:30 p. m.).
function formatTime(date) {
    return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })
}

// Hora con la que se ordena cada elemento.
// La excusa toma la hora de creacion de su tarea: queda en el lugar que ocupaba.
function sortTime(item) {
    return item instanceof Excuse ? item.taskCreatedAt.getTime() : item.createdAt.getTime()
}

export function renderTodayTask(list, parent, excuses = []) {
    // Renderiza las tasks y excusas en el contenedor seleccionado.
    // Limpia el contenedor previo
    parent.innerHTML = "";

    // Tareas y excusas mezcladas por hora.
    const items = [...list, ...excuses].sort((a, b) => sortTime(a) - sortTime(b))

    if (items.length === 0) {
        return parent.innerHTML = "No hay tareas para mostrar."
    }

    items.forEach((item) => {
        const card = item instanceof Excuse ? renderExcuseCard(item) : renderTaskCard(item)
        parent.appendChild(card)
    })
}

// Tarjeta de una excusa (tarea eliminada). Solo lectura.
function renderExcuseCard(excuse) {
    const divExcuse = document.createElement("div");
    divExcuse.className = "card excuse-card rounded-5";

    divExcuse.innerHTML =
        `<div class="card-body p-3">
            <div class="d-flex justify-content-between align-items-start gap-2">
                <h6 class="m-0 text-decoration-line-through" data-excuse-title></h6>
                <span class="badge rounded-pill excuse-badge">Con excusa</span>
            </div>
            <small class="d-block" data-excuse-meta></small>
            <p class="m-0 mt-1 small fst-italic excuse-text" data-excuse-text></p>
        </div>`

    // textContent: el texto lo escribe el usuario, no se interpreta como HTML.
    divExcuse.querySelector('[data-excuse-title]').textContent = excuse.taskTitle
    divExcuse.querySelector('[data-excuse-meta]').textContent = `Eliminada a las: ${formatTime(excuse.createdAt)}`
    divExcuse.querySelector('[data-excuse-text]').textContent = `“${excuse.text}”`

    return divExcuse
}

// Tarjeta de una tarea.
function renderTaskCard(task) {
    const divTaks = document.createElement("div");
    // Clases para el elemento
    divTaks.className = "card task task-clickable rounded-5";
    divTaks.tabIndex = 0;
    divTaks.setAttribute("role", "button");
    divTaks.setAttribute("aria-label", "Ver detalle de la tarea");
    // Hora y fecha actual
    const actualDate = new Date()

    // Decoradores de prioridad
    const priorityLabel = task.getPriorityLabel();
    const priorityColors = priorityColor(task.priority);

    // Estado de la tarea y colores para el badge.
    const taskStatus = task.getTaskStatus(actualDate)
    const statusColor = badgeStatusColor(taskStatus)

    const deadLine = formatTime(task.deadline)

    const taskCompleteAt = task.completedAt
        ? `Completada a las: ${formatTime(task.completedAt)}`
        : `Venció a las: ${deadLine}`

    const taskExpired = ! task.completed && actualDate.getTime() > task.deadline.getTime()
                        ? 'Venció a las: ' + deadLine
                        : 'Vence a las: ' + deadLine


    divTaks.innerHTML =
        `<div class="card-body p-3 d-flex justify-content-between">
            <div>
            <h6 class="m-0">${task.title}</h6>
            <small>Prioridad:
            <span class="badge rounded-pill"
            style="background-color: ${priorityColors.bg}; color: ${priorityColors.text};">
            ${priorityLabel}
            </span> -
            ${task.completed ? taskCompleteAt : taskExpired}</span>
            </small>
            </div>
            <div>
            <button type="button" id="task-status-${task.id}" data-task-status
            class="badge rounded-pill mt-2 border-0"
            style="background-color: ${statusColor.bg}; color: ${statusColor.text};"
            title="Cambiar estado" ${task.isOverdue() ? 'disabled' : ''}>
            ${ taskStatus }
            </button>
            </div>
        </div>`

    // Listener cambio de estado de la tarea.
    divTaks.querySelector('[data-task-status]').addEventListener('click', () => {
        task.toggleTaskStatus()
        updateTaskLocalStorage(task)
        emit(EVENTS.TASK_UPDATED, task)
    })

    // Abre la vista detallada (ignora el clic en el boton de estado).
    const openDetail = (e) => {
        if (e.target.closest('[data-task-status]')) return
        emit(EVENTS.OPEN_TASK_DETAIL, task.id)
    }
    divTaks.addEventListener('click', openDetail)
    divTaks.addEventListener('keydown', (e) => {
        // Solo si el foco esta en la tarjeta (no en el boton de estado).
        if (e.target !== divTaks) return
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openDetail(e)
        }
    })

    return divTaks
}

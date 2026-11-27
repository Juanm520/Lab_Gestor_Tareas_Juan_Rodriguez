import { EVENTS, emit, on } from "../../utils/events.js";
import { modalTemplate, openModal, closeModal, onModalShown, onModalHidden } from "../../utils/modal.js";
import { taskFormTemplate, setupTaskForm } from "../taskForm/taskForm.js";
import { updateTaskLocalStorage, getTaskByIdLocalStorage } from "../../services/tasksInlocalStorage.js";
import { badgeStatusColor } from "../../utils/tasksDataDecorators.js";
import { Task } from "../../models/Task.js";

const MODAL_ID = 'detail_task_modal'
const FORM_PREFIX = 'detail_task'

// Titulos del modal segun el modo.
const TITLES = {
    view: 'Detalle de la tarea',
    edit: 'Editar tarea',
}

// Info de solo lectura que va arriba de los campos.
const infoTemplate = `
    <section class="mb-2" data-task-info>
        <div class="d-flex flex-wrap align-items-center gap-2">
            <span class="badge rounded-pill" data-info-status></span>
            <small data-info-created></small>
            <small data-info-completed></small>
        </div>
        <small class="d-block mt-1 text-warning" data-info-locked></small>
    </section>`

// Formato de hora para mostrar (ej: 03:30 p. m.).
function formatTime(date) {
    return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })
}

// Componente <show-detail-task-modal>
// Modos: 'view' (detalle, campos bloqueados) y 'edit' (actualizar campos).
// Se abre con emit(EVENTS.OPEN_TASK_DETAIL, id) y emite EVENTS.TASK_UPDATED al guardar.
class ShowDetailTaskModal extends HTMLElement {

    connectedCallback() {
        this.innerHTML = modalTemplate({
            id: MODAL_ID,
            title: TITLES.view,
            body: taskFormTemplate({
                prefix: FORM_PREFIX,
                top: infoTemplate,
                buttons: `
                    <button type="submit" class="btn btn-success d-none" data-save>Guardar cambios</button>
                    <button type="button" class="btn btn-success d-none" data-edit>Editar</button>
                    <button type="button" class="btn btn-outline-warning" data-bs-dismiss="modal">Cerrar</button>`,
            }),
            contentClass: 'new-task',
        })

        this.mode = 'view'
        this.task = null

        this.render()
    }

    disconnectedCallback() {
        this.offOpen?.()
    }

    render() {
        this.modalElement = this.querySelector(`#${MODAL_ID}`)
        this.modalTitle = this.querySelector(`#${MODAL_ID}_title`)
        this.taskForm = setupTaskForm(this, FORM_PREFIX)
        this.info = this.querySelector('[data-task-info]')
        this.btnSave = this.querySelector('[data-save]')
        this.btnEdit = this.querySelector('[data-edit]')

        // Submit (solo guarda en modo edicion).
        this.taskForm.form.addEventListener('submit', (e) => this.handleSubmit(e))

        // Pasa de vista a edicion.
        this.btnEdit.addEventListener('click', () => {
            this.setMode('edit')
            this.taskForm.inpTitle.focus()
        })

        // Apertura del detalle de una tarea.
        this.offOpen = on(EVENTS.OPEN_TASK_DETAIL, (id) => this.open(id))

        // Al abrir: enfoca el boton principal. Al cerrar: limpia el formulario.
        onModalShown(this.modalElement, () => {
            if (!this.btnEdit.classList.contains('d-none')) this.btnEdit.focus()
        })
        onModalHidden(this.modalElement, () => {
            this.taskForm.reset()
            this.task = null
            this.setMode('view')
        })
    }

    // Carga la tarea y abre el modal en modo vista.
    open(id) {
        const task = getTaskByIdLocalStorage(id)
        if (!task) return

        this.task = task
        this.taskForm.fill(task)
        this.fillInfo(task)
        this.setMode('view')
        openModal(this.modalElement)
    }

    // Info de solo lectura (textContent evita inyectar HTML).
    fillInfo(task) {
        const status = task.getTaskStatus(new Date())
        const statusColor = badgeStatusColor(status)
        const badge = this.info.querySelector('[data-info-status]')
        badge.textContent = status
        badge.style.backgroundColor = statusColor.bg
        badge.style.color = statusColor.text

        this.info.querySelector('[data-info-created]').textContent =
            `Creada: ${task.getCreatedAt().toLocaleDateString('es-CO', { day: 'numeric', month: 'long' })}, ${formatTime(task.getCreatedAt())}`

        this.info.querySelector('[data-info-completed]').textContent =
            task.completedAt ? `· Completada: ${formatTime(task.completedAt)}` : ''

        this.info.querySelector('[data-info-locked]').textContent = this.canEdit(task)
            ? ''
            : 'Solo se pueden editar tareas de hoy que no estén hechas.'
    }

    // Solo se editan tareas creadas hoy y que no esten completadas.
    canEdit(task) {
        return !task.isCompleted()
            && task.getCreatedAt().toDateString() === new Date().toDateString()
    }

    // Ajusta la UI segun el modo.
    setMode(mode) {
        this.mode = mode
        const isView = mode === 'view'

        this.taskForm.fields.disabled = isView
        this.btnSave.classList.toggle('d-none', isView)
        this.btnEdit.classList.toggle('d-none', !(isView && this.task && this.canEdit(this.task)))
        this.modalTitle.textContent = TITLES[mode]
        this.taskForm.showError()
    }

    // Maneja el submit del formulario.
    handleSubmit(e) {
        e.preventDefault()

        if (this.mode !== 'edit' || !this.taskForm.validations()) {
            return
        }

        const data = new FormData(this.taskForm.form)

        // Trabaja sobre una copia: si algun setter falla, la tarea original no cambia.
        const editedTask = Task.fromJSON(JSON.parse(JSON.stringify(this.task)))

        try {
            editedTask.update({
                title: data.get('title'),
                description: data.get('description'),
                priority: data.get('priority'),
                deadline: new Date(editedTask.getCreatedAt().toDateString() + ' ' + data.get('deadline')),
            })
        } catch (error) {
            this.taskForm.showError(error.message)
            return
        }

        updateTaskLocalStorage(editedTask)

        // Avisa a las listas y estadisticas que la tarea cambio.
        emit(EVENTS.TASK_UPDATED, editedTask)

        closeModal(this.modalElement)
    }
}

customElements.define('show-detail-task-modal', ShowDetailTaskModal)

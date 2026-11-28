import { EVENTS, emit, on } from "../../utils/events.js";
import { modalTemplate, openModal, closeModal, onModalShown, onModalHidden } from "../../utils/modal.js";
import { getTaskByIdLocalStorage, deleteTaskLocalStorage } from "../../services/tasksInlocalStorage.js";
import { newExcuseLocalStorage } from "../../services/excusesInLocalStorage.js";
import { Excuse } from "../../models/Excuse.js";

const MODAL_ID = 'excuse_modal'
const MIN_CHARS = 100
const MAX_CHARS = 1000

// HTML del formulario de la excusa.
const formTemplate = `
    <form class="card gap-2 p-2 bg-dark border-0" id="excuse_form" novalidate>
        <p class="m-0 small">Vas a eliminar: <strong data-excuse-task></strong></p>
        <div class="form-floating">
            <textarea name="excuse" class="form-control task-field" placeholder="" id="excuse_text_area"
                style="height: 160px" maxlength="${MAX_CHARS}" aria-describedby="excuse_count"></textarea>
            <label for="excuse_text_area" class="p-2">Escribe tu excusa (mínimo ${MIN_CHARS} caracteres)</label>
        </div>
        <small id="excuse_count" class="excuse-count" data-excuse-count aria-live="polite"></small>
        <div class="d-flex flex-row-reverse pt-2 gap-4">
            <button type="submit" class="btn excuse-submit" data-excuse-submit disabled>Enviar excusa</button>
            <button type="button" class="btn btn-outline-warning" data-bs-dismiss="modal">Cancelar</button>
        </div>
    </form>`

// Componente <excuse-modal>
// Se abre con emit(EVENTS.OPEN_EXCUSE, id). Al enviar guarda la excusa,
// elimina la tarea y emite EVENTS.TASK_DELETED.
class ExcuseModal extends HTMLElement {

    connectedCallback() {
        this.innerHTML = modalTemplate({
            id: MODAL_ID,
            title: '¿Por qué no la vas a hacer?',
            body: formTemplate,
            contentClass: 'new-task',
        })

        this.task = null

        this.render()
    }

    disconnectedCallback() {
        this.offOpen?.()
    }

    render() {
        this.modalElement = this.querySelector(`#${MODAL_ID}`)
        this.form = this.querySelector('#excuse_form')
        this.textArea = this.querySelector('#excuse_text_area')
        this.taskTitle = this.querySelector('[data-excuse-task]')
        this.count = this.querySelector('[data-excuse-count]')
        this.btnSubmit = this.querySelector('[data-excuse-submit]')

        // Contador y activacion del boton.
        this.textArea.addEventListener('input', () => this.updateState())

        // Submit.
        this.form.addEventListener('submit', (e) => this.handleSubmit(e))

        // Apertura desde el modal de detalle.
        this.offOpen = on(EVENTS.OPEN_EXCUSE, (id) => this.open(id))

        // Al abrir: enfoca la excusa. Al cerrar: limpia el formulario.
        onModalShown(this.modalElement, () => this.textArea.focus())
        onModalHidden(this.modalElement, () => this.reset())
    }

    // Carga la tarea y abre el modal.
    open(id) {
        const task = getTaskByIdLocalStorage(id)
        if (!task) return

        this.task = task
        this.taskTitle.textContent = task.getTitle()
        this.updateState()
        openModal(this.modalElement)
    }

    // Largo de la excusa sin espacios al inicio y al final.
    excuseLength() {
        return this.textArea.value.trim().length
    }

    // Actualiza el contador y habilita el boton desde MIN_CHARS.
    updateState() {
        const length = this.excuseLength()
        const missing = MIN_CHARS - length

        this.count.textContent = missing > 0
            ? `Faltan ${missing} ${missing === 1 ? 'carácter' : 'caracteres'}.`
            : `${length}/${MAX_CHARS} caracteres.`

        this.btnSubmit.disabled = missing > 0
    }

    // Guarda la excusa y elimina la tarea.
    handleSubmit(e) {
        e.preventDefault()

        if (!this.task || this.excuseLength() < MIN_CHARS) {
            return
        }

        const excuse = new Excuse(
            this.task.id,
            this.task.getTitle(),
            this.task.getPriority(),
            this.task.getCreatedAt(),
            this.textArea.value.trim()
        )

        // Primero guarda la excusa: si falla, la tarea no se pierde.
        newExcuseLocalStorage(excuse)
        deleteTaskLocalStorage(this.task.id)

        // Avisa a las listas y estadisticas.
        emit(EVENTS.TASK_DELETED, excuse)

        closeModal(this.modalElement)
    }

    // Limpia el formulario.
    reset() {
        this.form.reset()
        this.task = null
        this.taskTitle.textContent = ''
        this.updateState()
    }
}

customElements.define('excuse-modal', ExcuseModal)

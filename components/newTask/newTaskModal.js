import { EVENTS, emit, on } from "../../utils/events.js";
import { modalTemplate, openModal, closeModal, onModalShown, onModalHidden } from "../../utils/modal.js";
import { taskFormTemplate, setupTaskForm } from "../taskForm/taskForm.js";
import { dataNewTask } from "./newTaskComponent.js";
import { newTaskLocalStorage } from "../../services/tasksInlocalStorage.js";

const MODAL_ID = 'new_task_modal'
const FORM_PREFIX = 'new_task'

// Componente <new-task-modal>
// Se abre con emit(EVENTS.OPEN_NEW_TASK) y emite EVENTS.TASK_CREATED al guardar.
class NewTaskModal extends HTMLElement {

    connectedCallback() {
        this.innerHTML = modalTemplate({
            id: MODAL_ID,
            title: 'Tarea para terminar ¡hoy!:',
            body: taskFormTemplate({
                prefix: FORM_PREFIX,
                buttons: `
                    <button type="submit" class="btn btn-success">Agregar tarea</button>
                    <button type="button" class="btn btn-outline-warning" data-bs-dismiss="modal">Cancelar</button>`,
            }),
            contentClass: 'new-task',
        })

        this.render()
    }

    disconnectedCallback() {
        this.offOpen?.()
    }

    render() {
        this.modalElement = this.querySelector(`#${MODAL_ID}`)
        this.taskForm = setupTaskForm(this, FORM_PREFIX)

        // Submit.
        this.taskForm.form.addEventListener('submit', (e) => this.handleSubmit(e))

        // Apertura desde cualquier componente.
        this.offOpen = on(EVENTS.OPEN_NEW_TASK, () => openModal(this.modalElement))

        // Al abrir: enfoca el titulo. Al cerrar: limpia el formulario.
        onModalShown(this.modalElement, () => this.taskForm.inpTitle.focus())
        onModalHidden(this.modalElement, () => this.taskForm.reset())
    }

    // Maneja el submit del formulario.
    handleSubmit(e) {
        e.preventDefault()

        if (!this.taskForm.validations()) {
            return
        }

        // Crea la task apartir de la clase Task y la aloja en LocalStorage.
        const newTask = dataNewTask(this.taskForm.form)
        newTaskLocalStorage(newTask)

        // Avisa a los demas componentes que hay una tarea nueva.
        emit(EVENTS.TASK_CREATED, newTask)

        // Cierra el modal (el reset se hace en onModalHidden).
        closeModal(this.modalElement)
    }
}

customElements.define('new-task-modal', NewTaskModal)

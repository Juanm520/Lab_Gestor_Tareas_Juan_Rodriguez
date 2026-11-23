import { titleValidation, descriptionValidation, priorityValidation, timeValidation, submitValidations } from "../../utils/formsValidations.js";
import { charCountingHTML } from "../../utils/charCounting.js";
import { EVENTS, emit, on } from "../../utils/events.js";
import { modalTemplate, openModal, closeModal, onModalShown, onModalHidden } from "../../utils/modal.js";
import { dataNewTask } from "./newTaskComponent.js";
import { newTaskLocalStorage } from "../../services/tasksInlocalStorage.js";

const MODAL_ID = 'new_task_modal'

// HTML del formulario.
const formTemplate = `
    <form class="card gap-1 p-2 bg-dark border-0" id="task_form" novalidate>
        <section id="task_title">
            <div class="form-floating mb-1 shadow">
                <input name="title" type="text" class="form-control" id="task_title_input" placeholder="" maxlength="50">
                <label for="task_title_input" class="p-2">Nombra la tarea para ¡hoy!</label>
            </div>
            <div class="d-flex flex-row-reverse">
                <h6><span id="count_char_title"></span>/50</h6>
            </div>
        </section>
        <section id="task_descr">
            <div class="form-floating mb-1">
                <textarea name="description" class="form-control" placeholder="" id="task_text_area" style="height: 100px" maxlength="500"></textarea>
                <label for="task_text_area" class="p-2">Añade la descripción o notas de la tarea:</label>
            </div>
            <div class="d-flex flex-row-reverse">
                <h6><span id="count_char_desc"></span>/500</h6>
            </div>
        </section>
        <section id="task_priority">
            <fieldset class="mb-3">
                <legend class="form-label fs-6">Prioridad:</legend>
                <div class="btn-group pb-2" role="group" aria-label="Botones para escoger prioridad">
                    <input type="radio" class="btn-check" name="priority" id="priority_low" value="low" autocomplete="off">
                    <label class="btn btn-outline-primary" for="priority_low">Baja</label>

                    <input type="radio" class="btn-check" name="priority" id="priority_medium" value="medium" autocomplete="off">
                    <label class="btn btn-outline-primary" for="priority_medium">Media</label>

                    <input type="radio" class="btn-check" name="priority" id="priority_high" value="high" autocomplete="off">
                    <label class="btn btn-outline-primary" for="priority_high">Alta</label>
                </div>
            </fieldset>
        </section>
        <section id="task_deadline_time">
            <div class="form-floating">
                <input name="deadline" type="time" class="form-control" id="task_deadline_time_input" placeholder="">
                <label for="task_deadline_time_input" class="p-2">Hora de finalización ¡hoy! (hh:mm p.m.)</label>
            </div>
        </section>
        <section id="task_submit">
            <div class="d-flex flex-row-reverse pt-2 gap-4">
                <button type="submit" class="btn btn-success">Agregar tarea</button>
                <button type="button" class="btn btn-outline-warning" data-bs-dismiss="modal">Cancelar</button>
            </div>
        </section>
    </form>`

// Componente <new-task-modal>
// Se abre con emit(EVENTS.OPEN_NEW_TASK) y emite EVENTS.TASK_CREATED al guardar.
class NewTaskModal extends HTMLElement {

    connectedCallback() {
        this.innerHTML = modalTemplate({
            id: MODAL_ID,
            title: 'Tarea para terminar ¡hoy!:',
            body: formTemplate,
            contentClass: 'new-task',
        })

        this.render()
    }

    disconnectedCallback() {
        this.offOpen?.()
    }

    render() {
        // Elementos a validar.
        this.modalElement = this.querySelector(`#${MODAL_ID}`)
        this.form = this.querySelector('#task_form')
        this.inpTitle = this.querySelector('#task_title_input')
        this.inpDescription = this.querySelector('#task_text_area')
        this.inpHour = this.querySelector('#task_deadline_time_input')
        this.charCountingTitle = this.querySelector('#count_char_title')
        this.charCountingDescription = this.querySelector('#count_char_desc')

        // Validaciones.
        this.validations = submitValidations(
            [titleValidation(this.inpTitle),
            descriptionValidation(this.inpDescription),
            priorityValidation(this.form),
            timeValidation(this.inpHour)],
            this.form
        )

        // Listeners del contador de caracteres.
        this.inpTitle.addEventListener('input', () => this.updateCounters())
        this.inpDescription.addEventListener('input', () => this.updateCounters())
        this.updateCounters()

        // Submit.
        this.form.addEventListener('submit', (e) => this.handleSubmit(e))

        // Apertura desde cualquier componente.
        this.offOpen = on(EVENTS.OPEN_NEW_TASK, () => openModal(this.modalElement))

        // Al abrir: enfoca el titulo. Al cerrar: limpia el formulario.
        onModalShown(this.modalElement, () => this.inpTitle.focus())
        onModalHidden(this.modalElement, () => this.resetForm())
    }

    // Contador de caracteres.
    updateCounters() {
        charCountingHTML(this.charCountingTitle, this.inpTitle, 50)
        charCountingHTML(this.charCountingDescription, this.inpDescription, 500)
    }

    // Maneja el submit del formulario.
    handleSubmit(e) {
        e.preventDefault()

        if (!this.validations()) {
            return
        }

        // Crea la task apartir de la clase Task y la aloja en LocalStorage.
        const newTask = dataNewTask(this.form)
        newTaskLocalStorage(newTask)

        // Avisa a los demas componentes que hay una tarea nueva.
        emit(EVENTS.TASK_CREATED, newTask)

        // Cierra el modal (el reset se hace en onModalHidden).
        closeModal(this.modalElement)
    }

    // Limpia valores, alertas y bordes de validacion.
    resetForm() {
        this.form.reset()
        this.querySelectorAll('.alerta-validacion').forEach(alerta => alerta.remove())
        this.querySelectorAll('.border-warning, .border-success').forEach(el => {
            el.classList.remove('border', 'border-warning', 'border-success')
        })
        this.updateCounters()
    }
}

customElements.define('new-task-modal', NewTaskModal)

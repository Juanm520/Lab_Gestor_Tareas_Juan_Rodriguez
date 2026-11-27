import { titleValidation, descriptionValidation, priorityValidation, timeValidation, submitValidations } from "../../utils/formsValidations.js";
import { charCountingHTML } from "../../utils/charCounting.js";

// Formulario de tarea compartido por los modales de crear y de detalle.
// Cada modal usa un prefijo distinto para no repetir IDs en la pagina.

// HTML del formulario.
// - top: HTML opcional antes de los campos (ej: info de la tarea).
// - buttons: HTML de los botones de accion.
export function taskFormTemplate({ prefix, top = '', buttons }) {
    return `
    <form class="card gap-1 p-2 bg-dark border-0" id="${prefix}_form" novalidate>
        ${top}
        <!-- Campos de la tarea -->
        <fieldset class="task-fields border-0 p-0 m-0" data-task-fields>
            <section>
                <div class="form-floating mb-1 shadow">
                    <input name="title" type="text" class="form-control task-field" id="${prefix}_title_input" placeholder="" maxlength="50">
                    <label for="${prefix}_title_input" class="p-2">Nombra la tarea para ¡hoy!</label>
                </div>
                <div class="d-flex flex-row-reverse">
                    <h6><span data-count-title></span>/50</h6>
                </div>
            </section>
            <section>
                <div class="form-floating mb-1">
                    <textarea name="description" class="form-control task-field" placeholder="" id="${prefix}_text_area" style="height: 100px" maxlength="500"></textarea>
                    <label for="${prefix}_text_area" class="p-2">Añade la descripción o notas de la tarea:</label>
                </div>
                <div class="d-flex flex-row-reverse">
                    <h6><span data-count-desc></span>/500</h6>
                </div>
            </section>
            <section>
                <fieldset class="mb-3">
                    <legend class="form-label fs-6">Prioridad:</legend>
                    <div class="btn-group pb-2" role="group" aria-label="Botones para escoger prioridad">
                        <input type="radio" class="btn-check" name="priority" id="${prefix}_priority_low" value="low" autocomplete="off">
                        <label class="btn btn-outline-priority" for="${prefix}_priority_low">Baja</label>

                        <input type="radio" class="btn-check" name="priority" id="${prefix}_priority_medium" value="medium" autocomplete="off">
                        <label class="btn btn-outline-priority" for="${prefix}_priority_medium">Media</label>

                        <input type="radio" class="btn-check" name="priority" id="${prefix}_priority_high" value="high" autocomplete="off">
                        <label class="btn btn-outline-priority" for="${prefix}_priority_high">Alta</label>
                    </div>
                </fieldset>
            </section>
            <section>
                <div class="form-floating">
                    <input name="deadline" type="time" class="form-control task-field" id="${prefix}_deadline_time_input" placeholder="">
                    <label for="${prefix}_deadline_time_input" class="p-2">Hora de finalización ¡hoy! (hh:mm p.m.)</label>
                </div>
            </section>
        </fieldset>

        <section>
            <small class="d-block text-warning" data-form-error></small>
            <div class="d-flex flex-row-reverse pt-2 gap-4">
                ${buttons}
            </div>
        </section>
    </form>`
}

// Conecta validaciones, contadores y reset del formulario renderizado en root.
export function setupTaskForm(root, prefix) {
    const form = root.querySelector(`#${prefix}_form`)
    const fields = form.querySelector('[data-task-fields]')
    const inpTitle = form.querySelector(`#${prefix}_title_input`)
    const inpDescription = form.querySelector(`#${prefix}_text_area`)
    const inpHour = form.querySelector(`#${prefix}_deadline_time_input`)
    const countTitle = form.querySelector('[data-count-title]')
    const countDescription = form.querySelector('[data-count-desc]')
    const formError = form.querySelector('[data-form-error]')

    // Validaciones.
    const validations = submitValidations(
        [titleValidation(inpTitle),
        descriptionValidation(inpDescription),
        priorityValidation(form),
        timeValidation(inpHour)],
        form
    )

    // Contador de caracteres.
    const updateCounters = () => {
        charCountingHTML(countTitle, inpTitle, 50)
        charCountingHTML(countDescription, inpDescription, 500)
    }
    inpTitle.addEventListener('input', updateCounters)
    inpDescription.addEventListener('input', updateCounters)
    updateCounters()

    // Llena los campos con los datos de una tarea.
    const fill = (task) => {
        inpTitle.value = task.getTitle()
        inpDescription.value = task.getDescription()
        inpHour.value = task.getDeadline().toTimeString().slice(0, 5)

        const priorityRadio = form.querySelector(`input[name="priority"][value="${task.getPriority()}"]`)
        if (priorityRadio) priorityRadio.checked = true

        updateCounters()
    }

    // Muestra un error general del formulario.
    const showError = (message = '') => {
        formError.textContent = message
    }

    // Limpia valores, alertas y bordes de validacion.
    const reset = () => {
        form.reset()
        // Busca en root: la alerta general y los bordes del form quedan fuera de form.querySelectorAll.
        root.querySelectorAll('.alerta-validacion').forEach(alerta => alerta.remove())
        root.querySelectorAll('.border-warning, .border-success').forEach(el => {
            el.classList.remove('border', 'border-warning', 'border-success')
        })
        showError()
        updateCounters()
    }

    return { form, fields, inpTitle, inpDescription, inpHour, validations, updateCounters, fill, showError, reset }
}

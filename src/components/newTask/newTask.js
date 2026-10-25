import { titleValidation, descriptionValidation, priorityValidation, timeValidation, submitValidations } from "../../utils/formsValidations.js";
import { charCountingHTML } from "../../utils/charCounting.js";

// Elementos a validar
const inpTitle = document.getElementById('task_title_input')
const charCountingTitle = document.getElementById('count_char_title')
const inpDescription = document.getElementById('task_text_area')
const charCountingDescription = document.getElementById('count_char_desc')
const form = document.getElementById('task_form')
const inpHour = document.getElementById('task_deadline_time_input')


const validations = submitValidations(
    [titleValidation(inpTitle),
    descriptionValidation(inpDescription),
    priorityValidation(form),
    timeValidation(inpHour)],
    form

)

// Listeners para ayudas visuales>>
// Agrega escucha del evento input para el contador de caracteres para title.
inpTitle.addEventListener('input', () => {
    charCountingHTML(charCountingTitle, inpTitle, 50)
})
// Agrega escucha del evento input para el contador de caracteres para description.
inpDescription.addEventListener('input', () => {
    charCountingHTML(charCountingDescription, inpDescription, 500)
})

// Controla el submit y la accion posterior.
form.addEventListener('submit', (e) => {
    e.preventDefault()

    if (!validations()) {
        return console.log('No envia')
    }
    
    console.log('Enviando')
    return form.reset()
})

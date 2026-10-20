import { titleValidation, descriptionValidation } from "../../utils/formsValidations.js";
import { charCountingHTML } from "../../utils/charCounting.js";

// Elementos a validar
const inpTitle = document.getElementById('task_title_input')
const charCountingTitle = document.getElementById('count_char_title')
const inpDescription = document.getElementById('task_text_area')
const charCountingDescription = document.getElementById('count_char_desc')

// Validaciones>>
 // Agrega la validacion de titulo> No vacio, maximo 50 caracteres.
titleValidation(inpTitle)
    // Agrega la validacion de descripcion> No vacio, maximo 500 caracteres.
descriptionValidation(inpDescription)


// Listeners>>
 // Agrega escucha del evento input para el contador de caracteres para title.
inpTitle.addEventListener('input', ()=>{
    charCountingHTML(charCountingTitle, inpTitle, 50)
})
 // Agrega escucha del evento input para el contador de caracteres para description.
inpDescription.addEventListener('input', ()=>{
    charCountingHTML(charCountingDescription, inpDescription, 500)
})


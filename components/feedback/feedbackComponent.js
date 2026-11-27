// Frases motivacionales { frase, subtitulo }.
const PHRASES = [
    { text: 'Una tarea cerrada es una decisión tomada.', note: 'Para mantener el ritmo en el cierre.' },
    { text: 'Lo que se termina hoy no pesa mañana.', note: 'Para liberar espacio en la agenda.' },
    { text: 'Avanzar poco sigue siendo avanzar.', note: 'Para los días con mucha carga.' },
    { text: 'Primero lo importante, después lo urgente.', note: 'Para elegir bien la siguiente tarea.' },
    { text: 'La constancia vence a la motivación.', note: 'Para sostener el hábito.' },
    { text: 'Una lista corta y terminada vale más que una larga y abierta.', note: 'Para planear el día con realismo.' },
    { text: 'Empieza por la tarea que más estás evitando.', note: 'Para quitarte el peso de encima.' },
]

// De momento, elige una frase por dia.
function phraseOfTheDay(date = new Date()) {
    const startOfYear = new Date(date.getFullYear(), 0, 0)
    const dayOfYear = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000))
    return PHRASES[dayOfYear % PHRASES.length]
}

// Define el componente <daily-phrase>
class DailyPhrase extends HTMLElement {

    connectedCallback() {
        const { text, note } = phraseOfTheDay()

        this.innerHTML = `
            <figure class="phrase-card rounded p-3 m-0">
                <blockquote class="m-0">
                    <p class="fw-bold m-0">“${text}”</p>
                </blockquote>
                <figcaption class="phrase-note m-0">${note}</figcaption>
            </figure>`
    }
}

customElements.define('daily-phrase', DailyPhrase)

import { getTasksLocalStorage } from "../../services/tasksInlocalStorage.js";
import { getExcusesLocalStorage } from "../../services/excusesInLocalStorage.js";

// Calcula las estadisticas de las tareas creadas hoy.
export function statsController(statsHTML) {
    const actualDate = new Date()

    // Tareas de hoy (compara dia, mes y año).
    const todayTasks = getTasksLocalStorage()
        .filter(task => task.createdAt.toDateString() === actualDate.toDateString())

    // Excusas de hoy: tareas eliminadas, cuentan como no hechas.
    const todayExcuses = getExcusesLocalStorage()
        .filter(excuse => excuse.taskCreatedAt.toDateString() === actualDate.toDateString())

    const total = todayTasks.length + todayExcuses.length
    const done = todayTasks.filter(task => task.isCompleted())
    const pending = todayTasks.filter(task => !task.isCompleted())
    const notDoneCount = pending.length + todayExcuses.length
    const criticalDone = done.filter(task => task.getPriority() === 'high').length
    const overdue = pending.filter(task => task.isOverdue()).length
    const excused = todayExcuses.length
    const score = total === 0 ? 0 : Math.round((done.length / total) * 100)

    // Valores principales.
    statsHTML.querySelector('[data-stats-done]').innerText = done.length
    statsHTML.querySelector('[data-stats-not-done]').innerText = notDoneCount
    statsHTML.querySelector('[data-stats-score]').innerText = `${score}%`

    // Textos de apoyo.
    statsHTML.querySelector('[data-stats-done-text]').innerText =
        `${criticalDone} ${criticalDone === 1 ? 'tarea crítica cerrada' : 'tareas críticas cerradas'}.`

    // Detalle de las no hechas: vencidas y con excusa.
    const notDoneDetails = []
    if (overdue > 0) notDoneDetails.push(`${overdue} ${overdue === 1 ? 'vencida' : 'vencidas'}`)
    if (excused > 0) notDoneDetails.push(`${excused} con excusa`)

    statsHTML.querySelector('[data-stats-not-done-text]').innerText =
        notDoneDetails.length > 0
            ? `${pending.length} ${pending.length === 1 ? 'pendiente' : 'pendientes'}, ${notDoneDetails.join(', ')}.`
            : `${pending.length} ${pending.length === 1 ? 'tarea queda pendiente' : 'tareas quedan pendientes'}.`

    statsHTML.querySelector('[data-stats-daily-score-text]').innerText =
        total === 0 ? 'Aún no hay tareas para hoy.' : 'Avance general del día.'

    statsHTML.querySelector('[data-stats-total-score-text]').innerText =
        total === 0 ? 'Aún no hay tareas para calcular' : 'Score total alcanzado.'

    // Barra de progreso del score.
    const bar = statsHTML.querySelector('[data-stats-daily-bar]')
    bar.style.width = `${score}%`
    bar.setAttribute('aria-valuenow', score)
}

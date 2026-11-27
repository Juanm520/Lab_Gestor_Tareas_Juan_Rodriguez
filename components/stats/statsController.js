import { getTasksLocalStorage } from "../../services/tasksInlocalStorage.js";

// Calcula las estadisticas de las tareas creadas hoy.
export function statsController(statsHTML) {
    const actualDate = new Date()

    // Tareas de hoy (compara dia, mes y año).
    const todayTasks = getTasksLocalStorage()
        .filter(task => task.createdAt.toDateString() === actualDate.toDateString())

    const total = todayTasks.length
    const done = todayTasks.filter(task => task.isCompleted())
    const notDone = todayTasks.filter(task => !task.isCompleted())
    const criticalDone = done.filter(task => task.getPriority() === 'high').length
    const overdue = notDone.filter(task => task.isOverdue()).length
    const score = total === 0 ? 0 : Math.round((done.length / total) * 100)

    // Valores principales.
    statsHTML.querySelector('[data-stats-done]').innerText = done.length
    statsHTML.querySelector('[data-stats-not-done]').innerText = notDone.length
    statsHTML.querySelector('[data-stats-score]').innerText = `${score}%`

    // Textos de apoyo.
    statsHTML.querySelector('[data-stats-done-text]').innerText =
        `${criticalDone} ${criticalDone === 1 ? 'tarea crítica cerrada' : 'tareas críticas cerradas'}.`

    statsHTML.querySelector('[data-stats-not-done-text]').innerText =
        overdue > 0
            ? `${notDone.length} pendientes, ${overdue} ${overdue === 1 ? 'vencida' : 'vencidas'}.`
            : `${notDone.length} ${notDone.length === 1 ? 'tarea queda pendiente' : 'tareas quedan pendientes'}.`

    statsHTML.querySelector('[data-stats-daily-score-text]').innerText =
        total === 0 ? 'Aún no hay tareas para hoy.' : 'Avance general del día.'

    statsHTML.querySelector('[data-stats-total-score-text]').innerText =
        total === 0 ? 'Aún no hay tareas para calcular' : 'Score general del año.'

    // Barra de progreso del score.
    const bar = statsHTML.querySelector('[data-stats-bar]')
    bar.style.width = `${score}%`
    bar.setAttribute('aria-valuenow', score)
}

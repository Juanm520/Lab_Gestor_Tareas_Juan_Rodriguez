import { renderTask } from "./renderTask.js";
import { getTasksLocalStorage } from "../../services/tasksInlocalStorage.js";

export function tasksController(tasksHTML) {
    // Obtiene las tareas.
    const tasks = getTasksLocalStorage()
    console.log('Tasks from localStorage:', tasks);

    // Titulos de los Containers de las tareas y Containers.
    const containerLatestTasks = tasksHTML.querySelector('[data-latest-tasks]')
    const containerTodayTasks = tasksHTML.querySelector('[data-today-tasks]')
    const titleLatestTasks = tasksHTML.querySelector('[data-latest-title]')
    const titleTodayTasks = tasksHTML.querySelector('[data-today-title]')

    // Define el dia y la hora actual.
    const actualDate = new Date()
    const yesterday = new Date(actualDate - 1 * 24 * 60 * 60 * 1000)

    // Define los titulos.
    titleLatestTasks.innerText =
        `${yesterday.toLocaleString('es-ES', { day: 'numeric', month: 'long' })}`

    titleTodayTasks.innerText =
        `${actualDate.toLocaleString('es-ES', { day: 'numeric', month: 'long' })}`

    // tareas de ayer.
    const latesTasks = tasks.filter(task => task.createdAt.getDate() === yesterday.getDate())
    renderTask(latesTasks, containerLatestTasks)

    // tareas de hoy.
    const todayTasks = tasks.filter(task => task.createdAt.getDate() === actualDate.getDate())
    renderTask(todayTasks, containerTodayTasks)

}

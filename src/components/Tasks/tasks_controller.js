import { renderTask } from "../../utils/renderTask.js";
import { getTasksLocalStorage } from "../../utils/localStorage.js";

// Obtiene las tareas.
const tasks = getTasksLocalStorage()

// Titulos de los Containers de las tareas y Containers.
const containerTooLatestTasks = document.getElementById('too_latest_tasks')
const containerLatestTasks = document.getElementById('latest_tasks')
const containerTodayTasks = document.getElementById('today_tasks')
const titleTooLatestTasks = document.getElementById('too_latest_title')
const titleLatestTasks = document.getElementById('latest_title')
const titleTodayTasks = document.getElementById('today_title')

// Define el dia y la hora actual.
const actualDate = new Date()

// Define los titulos.
titleTooLatestTasks.innerText = 
`${(actualDate.getDate() - 2)} de ${actualDate.toLocaleString('es-ES', { month: 'long' })}`

titleLatestTasks.innerText =
`${(actualDate.getDate() - 1)} de ${actualDate.toLocaleString('es-ES', { month: 'long' })}`

titleTodayTasks.innerText =
`${actualDate.getDate()} de ${actualDate.toLocaleString('es-ES', { month: 'long' })}`

// tareas de ayer.
const tooLatesTasks = tasks.filter(task => task.createdAt.getDate() < actualDate.getDate() - 1)
renderTask(tooLatesTasks, containerTooLatestTasks)

// tareas de ayer.
const latesTasks = tasks.filter(task => task.createdAt.getDate() < actualDate.getDate())
renderTask(latesTasks, containerLatestTasks)

// tareas de hoy.
const todayTasks = tasks.filter(task => task.createdAt.getDate() === actualDate.getDate())
renderTask(todayTasks, containerTodayTasks)



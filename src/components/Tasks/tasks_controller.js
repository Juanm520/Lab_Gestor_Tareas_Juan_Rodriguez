import { renderTask } from "./renderTask.js";
import { getTasksLocalStorage } from "../../services/tasksInlocalStorage.js";

// Obtiene las tareas.
const tasks = getTasksLocalStorage()

// Titulos de los Containers de las tareas y Containers.
const containerLatestTasks = document.getElementById('latest_tasks')
const containerTodayTasks = document.getElementById('today_tasks')
const titleLatestTasks = document.getElementById('latest_title')
const titleTodayTasks = document.getElementById('today_title')

// Define el dia y la hora actual.
const actualDate = new Date()
const yesterday = new Date(actualDate - 1 * 24 * 60 * 60 * 1000)

// Define los titulos.
titleLatestTasks.innerText =
`${yesterday.toLocaleString('es-ES', { day: 'numeric', month: 'long' })}`

titleTodayTasks.innerText =
`${actualDate.toLocaleString('es-ES', { day: 'numeric', month: 'long' })}`

// tareas de ayer.
const latesTasks = tasks.filter(task => task.createdAt.getDate() < actualDate.getDate())
renderTask(latesTasks, containerLatestTasks)

// tareas de hoy.
const todayTasks = tasks.filter(task => task.createdAt.getDate() === actualDate.getDate())
renderTask(todayTasks, containerTodayTasks)



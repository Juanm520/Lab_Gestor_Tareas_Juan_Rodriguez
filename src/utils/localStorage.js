//Importa clase task
import { Task } from "../models/task.js";

// Funciones para controlar el localStorage
const ITEM_TASKS = 'Tasks'


export function newTaskLocalStorage(task){

    // Valida la existencia del item. 
    if (! localStorage.getItem(ITEM_TASKS)){
        localStorage.setItem(ITEM_TASKS, JSON.stringify([]))
    }

    // Llama tareas y añade la tarea al array.
    const tasks = JSON.parse(localStorage.getItem(ITEM_TASKS))
    tasks.push(task)

    // 
    return localStorage.setItem(ITEM_TASKS, JSON.stringify(tasks))
}

export function getTasksLocalStorage(){

    // Valida la existencia del item. 
    if (! localStorage.getItem(ITEM_TASKS)){
        localStorage.setItem(ITEM_TASKS, JSON.stringify([]))
    }

    // Llama tareas y las retorna.
    const tasksLocalStorage = JSON.parse(localStorage.getItem(ITEM_TASKS))
    // Regex para recupera el string de la hora para crear la instancia nuevamente.
    const regexDeadline = /T(\d{2}:\d{2})/
    // Retorna en instancias Task.
    return tasksLocalStorage.map(task => new Task(task.title, task.description, task.priority, new Date(task.createdAt), task.deadline.match(regexDeadline)[1]))
}

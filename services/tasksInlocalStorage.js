//Importa clase task
import { Task } from "../models/Task.js";

// Funciones para controlar el localStorage
const ITEM_TASKS = 'Tasks'


export function newTaskLocalStorage(task){

    // Valida la existencia del item. 
    if (! localStorage.getItem(ITEM_TASKS)){
        localStorage.setItem(ITEM_TASKS, JSON.stringify([]))
    }

    // Llama tareas y añade la tarea al array.
    const tasks = JSON.parse(localStorage.getItem(ITEM_TASKS))
    console.log('Task to add:', task);
    tasks.push(task)

    // 
    return localStorage.setItem(ITEM_TASKS, JSON.stringify(tasks))
}

// Reemplaza la tarea guardada con el mismo id.
export function updateTaskLocalStorage(task){
    const tasks = JSON.parse(localStorage.getItem(ITEM_TASKS) ?? '[]')
    const updatedTasks = tasks.map(taskJSON => taskJSON.id === task.id ? task : taskJSON)

    return localStorage.setItem(ITEM_TASKS, JSON.stringify(updatedTasks))
}

export function getTasksLocalStorage(){

    // Valida la existencia del item. 
    if (! localStorage.getItem(ITEM_TASKS)){
        localStorage.setItem(ITEM_TASKS, JSON.stringify([]))
        return []
    }

    // Llama tareas y las retorna.
    const tasksLocalStorage = JSON.parse(localStorage.getItem(ITEM_TASKS))

    // Retorna en instancias Task conservando id y estado.
    return tasksLocalStorage.map(taskJSON => Task.fromJSON(taskJSON))
}

// Busca una tarea por id. Retorna null si no existe.
export function getTaskByIdLocalStorage(id){
    return getTasksLocalStorage().find(task => task.id === id) ?? null
}

// Elimina la tarea con el id dado.
export function deleteTaskLocalStorage(id){
    const tasks = JSON.parse(localStorage.getItem(ITEM_TASKS) ?? '[]')
    const remainingTasks = tasks.filter(taskJSON => taskJSON.id !== id)

    return localStorage.setItem(ITEM_TASKS, JSON.stringify(remainingTasks))
}

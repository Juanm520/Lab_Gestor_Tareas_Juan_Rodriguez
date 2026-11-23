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

export function getTasksLocalStorage(){

    // Valida la existencia del item. 
    if (! localStorage.getItem(ITEM_TASKS)){
            return localStorage.setItem(ITEM_TASKS, JSON.stringify([]))
    }

    // Llama tareas y las retorna.
    const tasksLocalStorage = JSON.parse(localStorage.getItem(ITEM_TASKS))
    
    // Retorna en instancias Task.
    return tasksLocalStorage.map(task => new Task(
                                        task.title, 
                                        task.description, 
                                        task.priority, 
                                        new Date(task.createdAt), 
                                        new Date(task.deadline))
                                )
}

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
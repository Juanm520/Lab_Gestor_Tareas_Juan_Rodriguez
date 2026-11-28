// Importa clase Excuse
import { Excuse } from "../models/Excuse.js";

// Funciones para controlar las excusas en el localStorage
const ITEM_EXCUSES = 'Excuses'

export function newExcuseLocalStorage(excuse){
    const excuses = JSON.parse(localStorage.getItem(ITEM_EXCUSES) ?? '[]')
    excuses.push(excuse)

    return localStorage.setItem(ITEM_EXCUSES, JSON.stringify(excuses))
}

export function getExcusesLocalStorage(){
    const excusesLocalStorage = JSON.parse(localStorage.getItem(ITEM_EXCUSES) ?? '[]')

    // Retorna en instancias Excuse.
    return excusesLocalStorage.map(excuseJSON => Excuse.fromJSON(excuseJSON))
}

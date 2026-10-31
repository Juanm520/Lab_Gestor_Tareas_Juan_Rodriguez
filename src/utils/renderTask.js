export function renderTask(list, parent) {
    // Renderiza las tasks en el contenedor seleccionado.
    parent.innerHTML = ""; // Limpia el contenedor previo

    if (list.length === 0) {
        return parent.innerHTML = "No hay tareas para mostrar."
    }

    list.forEach((task) => {
        const divTaks = document.createElement("div");
        // Clases para el elemento
        divTaks.className = "card task rounded-5";

        const actualDate = new Date()

        let isTaksCompleteString = ""

        if (task.createdAt.getDate() < actualDate.getDate()) {
            isTaksCompleteString = task.completed ? "Hecha" : "Vencida"
        }

        if (task.deadline > actualDate){
            isTaksCompleteString = task.completed ? "Hecha" : "Vencida"
        }

        const deadLine = task.deadline.toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })

        const taskCompleteAt = task.completedAt
            ? `Completada a las: ${task.completedAt.toLocaleTimeString('es-CO', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true}
               )}`
            : `Venció a las: ${deadLine}`

        divTaks.innerHTML =
            `<div class="card-body p-3 d-flex justify-content-between">
                <div>
                <h6 class="m-0">${task.title}</h6>
                <small>${isTaksCompleteString} - ${taskCompleteAt} </small>
                </div>
                <div>
                <span class="badge bg-light text-dark border rounded-pill mt-2">${ isTaksCompleteString ? "Cerrada" : "Abierta"}</span>
                </div>
            </div>`

        parent.appendChild(divTaks);
    })

}


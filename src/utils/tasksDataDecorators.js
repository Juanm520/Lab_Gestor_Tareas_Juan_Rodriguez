// Colores del badge según el estado.
const STATUS_COLORS = {
    "Abierta": { bg: "#243D31", text: "#FFFFFF" },
    "En progreso": { bg: "#356D57", text: "#FFFFFF" },
    "Hecha": { bg: "#78C69B", text: "#1A1A1A" },
    "Vencida": { bg: "#EB5050", text: "#FFFFFF" },
}

const priorityColors = {
            low: { bg: '#243D31', text: '#ffffff' },
            medium: { bg: '#356D57', text: '#ffffff' },
            high: { bg: '#78C69B', text: '#000000' }
        };

// Retorna los colores { bg, text } para el estado de la tarea (task.taskStatusBadge).
export function badgeStatusColor(status) {
    return STATUS_COLORS[status]
}

// Retorna los colores { bg, text } para la prioridad de la tarea (task.priority).
export function priorityColor(priority) {
    return priorityColors[priority]
}

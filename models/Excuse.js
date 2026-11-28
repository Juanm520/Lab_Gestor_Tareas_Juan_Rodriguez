// Excusa registrada al eliminar una tarea.
// Guarda los datos de la tarea porque la tarea ya no existe.
export class Excuse {
  constructor(taskId, taskTitle, taskPriority, taskCreatedAt, text, createdAt = new Date(), id = crypto.randomUUID()) {
    this.id = id;
    this.taskId = taskId;
    this.taskTitle = taskTitle;
    this.taskPriority = taskPriority;
    this.taskCreatedAt = taskCreatedAt;
    this.text = text;
    // Momento en que se elimino la tarea.
    this.createdAt = createdAt;
  }

  // Reconstruye una excusa guardada.
  static fromJSON(excuseJSON) {
    return new Excuse(
      excuseJSON.taskId,
      excuseJSON.taskTitle,
      excuseJSON.taskPriority,
      new Date(excuseJSON.taskCreatedAt),
      excuseJSON.text,
      new Date(excuseJSON.createdAt),
      excuseJSON.id
    );
  }
}

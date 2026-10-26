export class Task {
  constructor(title, description, priority, deadline) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.createdAt = new Date();
    // Calcula el deadline
    const dayDeadLine = this.createdAt.toISOString().split('T')[0];
    this.deadline = new Date(`${dayDeadLine}T${deadline}Z`);
    this.completed = false;
  }

  // Getters
  getTitle() {
    return this.title;
  }

  getDescription() {
    return this.description;
  }

  getPriority() {
    return this.priority;
  }

  getDeadline() {
    return this.deadline;
  }

  isCompleted() {
    return this.completed;
  }

  // Setters
  setTitle(title) {
    if (typeof title !== 'string' || !title.trim()) {
      throw new TypeError('El título es obligatorio.');
    }

    this.title = title.trim();
  }

  setDescription(description) {
    if (typeof description !== 'string') {
      throw new TypeError('La descripción debe ser un texto.');
    }

    this.description = description.trim();
  }

  setPriority(priority) {
    const validPriorities = ['low', 'medium', 'high'];

    if (!validPriorities.includes(priority)) {
      throw new RangeError('La prioridad debe ser low, medium o high.');
    }

    this.priority = priority;
  }

  setDeadline(deadline) {
    const date = new Date(deadline);

    if (Number.isNaN(date.getTime())) {
      throw new TypeError('La fecha límite no es válida.');
    }

    this.deadline = date;
  }

  // Cambiar estado
  complete() {
    this.completed = true;
  }

  toggleCompleted() {
    this.completed = !this.completed;
  }

  // Consultar estado de vencimiento
  isOverdue() {
    if (this.completed || !this.deadline) {
      return false;
    }

    return new Date(this.deadline).getTime() < Date.now();
  }

  // Actualizar varias propiedades
  update({ title, description, priority, deadline } = {}) {
    if (title !== undefined) this.setTitle(title);
    if (description !== undefined) this.setDescription(description);
    if (priority !== undefined) this.setPriority(priority);
    if (deadline !== undefined) this.setDeadline(deadline);
  }

  // Obtener todos los datos
  taskInfo() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      priority: this.priority,
      deadline: this.deadline,
      completed: this.completed,
      createdAt: this.createdAt
    };
  }
}
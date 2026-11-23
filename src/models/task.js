export class Task {
  constructor(title, description, priority, createdAt, deadline, completed = false, completedAt = null) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.createdAt = createdAt;
    this.deadline = deadline;
    this.completed = completed;
    this.completedAt = completedAt;
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

  getCreatedAt() {
    return this.createdAt;
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
    if (!deadline instanceof Date) {
      throw new TypeError('El deadline debe ser una fecha válida.');
    }

    // No puede ser anterior a la fecha de creación.
    if (deadline.getTime() < this.createdAt.getTime()) {
      throw new RangeError('El deadline no puede ser anterior a la fecha de creación.');
    }

    // No puede pasar del final del día actual (23:59:59.999 hora local).
    const endOfToday = new Date().setHours(23, 59, 59, 999)
    if (deadline.getTime() > endOfToday.getTime()) {
      throw new RangeError('El deadline no puede ser posterior al día actual.');
    }

    this.deadline = deadline;
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
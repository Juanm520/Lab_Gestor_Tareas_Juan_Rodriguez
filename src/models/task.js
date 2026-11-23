export class Task {
  constructor(title, description, priority, createdAt, deadline, inProgress = false, completed = false, completedAt = null, id = crypto.randomUUID()) {
    // El id se genera si no se recibe el parametro.
    this.id = id;
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.createdAt = createdAt;
    this.deadline = deadline;
    this.inProgress = inProgress;
    this.completed = completed;
    this.completedAt = completedAt;
  }

  // Reconstruye una tarea existente.
  static fromJSON(taskJSON) {
    return new Task(
      taskJSON.title,
      taskJSON.description,
      taskJSON.priority,
      new Date(taskJSON.createdAt),
      new Date(taskJSON.deadline),
      taskJSON.inProgress ?? false,
      taskJSON.completed ?? false,
      taskJSON.completedAt ? new Date(taskJSON.completedAt) : null,
      taskJSON.id
    );
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

  // Prioridad en español para mostrar en la UI.
  getPriorityLabel() {
    const labels = { low: 'Baja', medium: 'Media', high: 'Alta' };
    return labels[this.priority];
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

  getTaskStatus(actualDate) {
    if (this.completed) {
      return 'Hecha';
    }

    // Creada ayer o ya pasó el deadline: vencida.
    if (this.isOverdue(actualDate)) {
      return 'Vencida';
    }

    if (this.inProgress) {
      return 'En progreso';
    }

    return 'Abierta';
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

  // Cambiar a completada
  complete() {
    this.completed = true;
    this.inProgress = false;
    this.completedAt = new Date();
  }

  // Cambiar a en progreso
  toProgress() {
    this.inProgress = true;
    this.completed = false;
    this.completedAt = null;
  }

  // Cambiar a abierta
  toUncompleted() {
    this.inProgress = false;
    this.completed = false;
    this.completedAt = null;
  }
  


  // Avanza el estado: Abierta -> En progreso -> Hecha -> Abierta.
  toggleTaskStatus() {
    // Si es completada, la vuelve a abierta.
    if (this.completed) {
      this.toUncompleted()
      return;
    }

    // Si está en progreso, la vuelve hecha.
    if (this.inProgress) {
      this.complete();
      return;
    }
    
    // Si está abierta, la vuelve en progreso.
    if (!this.inProgress && !this.completed) {
      this.toProgress();
      return;
    }
  }

  // Consultar estado de vencimiento
  isOverdue() {
    if (this.completed) {
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
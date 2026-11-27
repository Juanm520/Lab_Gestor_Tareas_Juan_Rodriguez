import { Task } from '../../models/Task.js';

export function dataNewTask(form) {
    const formData = new FormData(form);
    
    const title = formData.get('title').trim();
    const description = formData.get('description').trim();
    const priority = formData.get('priority');
    const createdAt = new Date()
    const deadlineForm = formData.get('deadline');
    const deadline = new Date(createdAt.toDateString() + ' ' + deadlineForm);

    return new Task(
        title,
        description,
        priority,
        createdAt,
        deadline
    );
}

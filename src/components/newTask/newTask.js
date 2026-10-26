import { Task } from './../../models/task.js';

export function dataNewTask(form) {
    const formData = new FormData(form);
    
    const title = formData.get('title').trim();
    const description = formData.get('description').trim();
    const priority = formData.get('priority');
    const deadline = formData.get('deadline');

    const newTask = new Task(
        title,
        description,
        priority,
        deadline
    );

    return newTask
}

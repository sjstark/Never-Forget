import {updateTask} from './showTaskDetails.js'

export const handleChecking = (checkBox, task) => {
  if (task.isComplete) checkBox.checked = true;

  checkBox.onclick = (e) => {
    e.stopPropagation();

    checkBox.parentElement.classList.add('task-deleted')

    checkBox.disabled = true;
    checkBox.parentElement.onclick = null

    updateTask(task.id, 'isComplete', checkBox.checked)

  }
}

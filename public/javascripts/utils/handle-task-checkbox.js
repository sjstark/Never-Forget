export const handleChecking = (checkBox, task) => {
  if (task.isComplete) checkBox.checked = true;

  checkBox.onclick = (e) => {
    e.stopPropagation();

    checkBox.parentElement.classList.add('task-deleted')

  }
}

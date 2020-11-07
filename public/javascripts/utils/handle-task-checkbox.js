import {updateTask} from './showTaskDetails.js'

export const handleChecking = (checkBox, task) => {
  if (task.isComplete) checkBox.checked = true;

  checkBox.onclick = (e) => {
    e.stopPropagation();

    checkBox.disabled = true;
    let listItem = checkBox.parentElement

    let currentPosition = listItem.getBoundingClientRect();
    let deadListItem = document.createElement('div')

    deadListItem.className = 'task-deleted'
    deadListItem.innerHTML = listItem.innerHTML
    deadListItem.querySelector('input').checked = checkBox.checked;

    deadListItem.style.left = currentPosition.left;
    deadListItem.style.top = currentPosition.top;
    deadListItem.style.width = `${currentPosition.right - currentPosition.left}px`

    listItem.replaceWith(deadListItem)

    deadListItem.onclick = (e) => {
      e.preventDefault()
      e.stopPropagation()
    }



    updateTask(task.id, 'isComplete', checkBox.checked)
    setTimeout(() => {
      deadListItem.classList.add('task-deleted--off')
    }, 150)
  }
}

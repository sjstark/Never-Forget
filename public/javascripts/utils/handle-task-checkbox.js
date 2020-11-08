import {updateTask} from './showTaskDetails.js'
import { updateTaskSummary } from './updateTaskSummary.js';

export const handleChecking = (checkBox, task) => {
  if (task.isComplete) checkBox.checked = true;

  checkBox.onclick = async (e) => {
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



    await updateTask(task.id, 'isComplete', checkBox.checked)
    await updateThisListSummary()
    setTimeout(() => {
      deadListItem.classList.add('task-deleted--off')
    }, 150)
  }
}

const updateThisListSummary = async () => {

  let listId = localStorage.getItem("never-forget-currentList")
    ? localStorage.getItem("never-forget-currentList")
    : null;
  if (listId === "null") listId = null;

  let route = "/tasks";
  if (listId) {
    if (listId.startsWith('search:')){
      let searchInput = listId.slice(7)
      route = `/tasks/search?includes=${encodeURI(searchInput)}`
    } else {
      route = `/lists/${listId}`
    }
  }

  let res = await fetch(route);
  let body = await res.json();

  let tasks = body.allTasks;

  //update task summary
  updateTaskSummary(tasks);

}

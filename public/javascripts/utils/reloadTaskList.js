import {showTaskDetails} from './showTaskDetails.js'

/******************************************************************************/
/************************* BUILD TASK HTML ELEMENT ****************************/
/******************************************************************************/

export const reloadTaskList = async () => {
  const taskList = document.querySelector('.task-list__tasks')

  let listId = localStorage.getItem('never-forget-currentList') ? localStorage.getItem('never-forget-currentList') : null;
  if (listId === 'null') listId = null;

  let route = '/tasks'
  if (listId) {
    route = `/lists/${listId}`
  }

  let res = await fetch(route)
  let body = await res.json();

  let tasks = body.allTasks

  taskList.innerHTML = ''

  // getTotalEstimate(tasks)

  tasks.forEach(task => {
    taskList.appendChild(createTaskItem(task))
  })
}

const createTaskItem = (task) => {
  let taskItem = document.createElement('div')
  taskItem.classList.add('task-list__task-item')
  taskItem.id = `Task-${task.id}`
  taskItem.innerHTML = `
  <div class="task-list__task-bar"></div>
  <div class="task-list__task-select"></div>
  <span class="task-list__task-title">${task.title}</span>`

  taskItem.addEventListener('click', showTaskDetails)
  return taskItem
}

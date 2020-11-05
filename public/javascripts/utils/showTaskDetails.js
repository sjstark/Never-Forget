export const showTaskDetails = async (e) => {
  e.stopPropagation();

  let taskDiv
  if (e.target.className !== 'task-list__task-item') {
    taskDiv = e.target.parentElement
  } else {
    taskDiv = e.target
  }

  let taskId = taskDiv.id.slice(5)

  let task = await getTaskById(taskId)

  displayDetails(task)
}


const displayDetails = (task) => {
  const taskTitleEl = document.querySelector('.task-details__task-title')
  const taskModifiersContainer = document.querySelector('.task-details__details-container-modifiers')
  const taskListContainer = document.querySelector('.task-details__details-container-list')
  const detailsDiv = document.querySelector('.details')

  if (!detailsDiv.className.includes('details--shown')) {
    detailsDiv.classList.add('details--shown')
  }

  taskTitleEl.innerHTML = task.title
}


const getTaskById = async (taskId) => {
  let res = await fetch(`/tasks/${taskId}`)
  let task = await res.json();

  return task
}

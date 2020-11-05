export const showTaskDetails = async (e) => {
  e.stopPropagation();

  let taskDiv
  if (e.target.className !== 'task-list__task-item') {
    taskDiv = e.target.parentElement
  } else {
    taskDiv = e.target
  }

  let taskId = taskDiv.id.slice(5)

  let task = getTaskById(taskId)

  showTaskDetails(task)
}


const showTaskDetails = (task) => {

}


const getTaskById = (taskId) => {
  let res = await fetch(`/tasks/${taskId}`)
  let task = await res.json();

  return task
}

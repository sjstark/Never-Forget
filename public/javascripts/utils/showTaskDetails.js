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
  document.querySelector('.task-details__dueDate').innerHTML = task.dueDate ? task.dueDate : "none"
  document.querySelector('.task-details__estimate').innerHTML = task.estimate ? task.estimate : "none"
  document.querySelector('.task-details__list').innerHTML = task.listId ? task.listId : "none"
  document.querySelector('.task-details__completed-status').innerHTML = task.isComplete

  document.querySelectorAll('i.far.fa-edit').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation()
      let editContainer = e.target.parentElement.parentElement
      createInputField(editContainer)
    })
  })
}

const createInputField = (editContainer) => {
  let editField = editContainer.querySelector('.editField')
  let inputField = document.createElement('input')
  inputField.value = editField.innerText

  inputField.addEventListener('focusout', submitChange)
  inputField.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      submitChange(e)
    }
  })

  editContainer.replaceChild(inputField, editField)

  inputField.focus();
}

const getTaskById = async (taskId) => {
  let res = await fetch(`/tasks/${taskId}`)
  let task = await res.json();

  return task
}

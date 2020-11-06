import {reloadTaskList} from './reloadTaskList.js'

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

  const closeButton = document.querySelector('.close-button')
  const deleteButton = document.querySelector('.task-details__delete-button')

  closeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const detailsDiv = document.querySelector('.details')
    detailsDiv.classList.remove('details--shown')
  })

  deleteButton.addEventListener('click', async (e) => {
    if (confirm(`Are you sure you'd like to delete this task?\nTask Title: ${task.title}`)) {
      await deleteTask(taskId)

      reloadTaskList()

      document.querySelector('.details').classList.remove('details--shown')
    }
  })

}


const displayDetails = (task) => {
  document.querySelector('.task-details__task-id').innerHTML = task.id
  const taskTitleEl = document.querySelector('.task-details__task-title')
  const detailsDiv = document.querySelector('.details')

  if (!detailsDiv.className.includes('details--shown')) {
    detailsDiv.classList.add('details--shown')
  }
  taskTitleEl.innerHTML = task.title
  document.querySelector('.task-details__task-dueDate').innerHTML = task.dueDate ? task.dueDate : "none"
  document.querySelector('.task-details__task-estimate').innerHTML = task.estimate ? task.estimate : "none"
  document.querySelector('.task-details__task-listId').innerHTML = task.listId ? task.listId : "none"
  document.querySelector('.task-details__task-isComplete').innerHTML = task.isComplete

  document.querySelectorAll('i.far.fa-edit').forEach(el => {
    el.addEventListener('mouseover', (e) => {
      e.stopPropagation()
      e.target.style.color = "blue";

      setTimeout(function() {
        e.target.style.color = "";
      }, 500);
      let editContainer = e.target.parentElement.parentElement
      createInputField(editContainer)
    })
  }, false);
}

const createInputField = (editContainer) => {
  let editField = editContainer.querySelector('.editField')
  let inputField = document.createElement('input')
  inputField.value = editField.innerText
  inputField.id = editField.className.split(' ')[0].slice(19)
  inputField.classList.add(editField.className.split(' ')[0])

  inputField.addEventListener('focusout', submitChange)
  inputField.addEventListener('keyup', async (e) => {
    if (e.key === 'Enter') {
      await submitChange(e)
    }
  })

  editContainer.replaceChild(inputField, editField)

  inputField.focus();
}

const submitChange = async (e) => {

  const task = {
    id: parseInt(document.querySelector('.task-details__task-id').innerHTML, 10),
    title: document.querySelector('.task-details__task-title').innerHTML,
    dueDate: document.querySelector('.task-details__task-dueDate').innerHTML !== 'none' ? parseInt(document.querySelector('.task-details__task-dueDate').innerHTML, 10) : null,
    estimate: document.querySelector('.task-details__task-estimate').innerHTML !== 'none' ? parseInt(document.querySelector('.task-details__task-estimate').innerHTML, 10) : null,
    listId: document.querySelector('.task-details__task-listId').innerHTML !== 'none' ? parseInt(document.querySelector('.task-details__task-listId').innerHTML, 10) : null,
    isComplete: document.querySelector('.task-details__task-isComplete').innerHTML,
  }

  console.log('changing!', e.target.value)

  let inputValue = e.target.value
  if (inputValue === 'none') inputValue = null;

  task[e.target.id] = inputValue

  await updateTask(task)


  let editField = document.createElement('span')
  editField.innerText = inputValue !== null ? inputValue : 'none'
  editField.classList.add(`task-details__task-${e.target.id}`)
  editField.classList.add('editField')

  console.log(e.target.parentElement)
  console.log(editField)
  console.log(e.target)

  e.target.parentElement.replaceChild(editField, e.target)

  console.log(editField.parentElement)

  reloadTaskList();

}

const updateTask = async ({id, title, dueDate, estimate, listId, isComplete}) => {
  let _csrf = document.querySelector('#csrf').value

  let body = {
    title, dueDate, estimate, listId, isComplete, _csrf
  }

  let options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }

  let res = await fetch(`/tasks/${id}`, options)
  if (!res.ok) alert('there was an error updating!')
}

const getTaskById = async (id) => {
  let res = await fetch(`/tasks/${id}`)
  let task = await res.json();

  return task
}

const deleteTask = async (id) => {
  let _csrf = document.querySelector('#csrf').value

  let body = {
    _csrf
  }

  let options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }

  let res = await fetch(`/tasks/${id}`, options)
  return res
}

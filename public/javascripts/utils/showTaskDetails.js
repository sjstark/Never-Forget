import {reloadTaskList} from './reloadTaskList.js'
import { getLists, getListId } from './list-utils.js'

export const showTaskDetails = async (taskId) => {

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

  const taskTitleEl = document.querySelector('.task-details__task-title')
  const detailsDiv = document.querySelector('.details')
  const dueDateField = document.querySelector('.task-details__task-dueDate')
  const estimateField = document.querySelector('.task-details__task-estimate')
  const listTitleField = document.querySelector('.task-details__task-listTitle')
  const isCompleteField = document.querySelector('.isComplete-checkbox')
  console.log(isCompleteField)

  if (!detailsDiv.className.includes('details--shown')) {
    detailsDiv.classList.add('details--shown')
  }

  taskTitleEl.innerText = task.title

  dueDateField.innerText = task.dueDate ? new Date(task.dueDate) : "none"
  estimateField.innerText = task.estimate ? task.estimate : "none"
  listTitleField.innerText = task.listId ? task.listId : "none"

  isCompleteField.checked = task.isComplete ? true : false;


  // document.querySelectorAll('.editContainer').forEach(el => {
  //   el.addEventListener('click', (e) => {
  //     console.log('line 58 target', e.target)
  //     let target = e.target
  //     while (target.className !== "editContainer") target = target.parentElement


  //     createInputField(target)

  //   })
  // }, false);

  // document.querySelector('.listContainer')
}

const formatDate = (date) => {
  let date = data.getDate()
  if (date < 10) {
    date = '0' + date
  }

  let month = date.getMonth() + 1;
  if (month < 10) {
    month = '0' + month
  }

  return date + '/' + month + '/' + date.getFullYear()
}




const createListDropdown = async (listContainer) => {

  let editField = editContainer.querySelector('.editField')
  let selectField = document.createElement('select')
  selectField.value = editField.innerText === 'none' ? null : editField.innerText
  let lists = await getLists();

  let nullOption = document.createElement('option')
  option.value = 'null';
  option.innerText = 'none'
  selectField.appendChild(nullOption)
  lists.forEach( list => {
    selectField.appendChild(createListOption(list))
  })
  let newListOption = document.createElement('option')
  option.value = 'NEWLIST';
  option.innerText = 'Create List'
  selectField.appendChild(newListOption)

  selectField.addEventListener('change', (e) => {
    let taskId = parseInt(document.querySelector('.task-details__task-id').innerText, 10)
    if (e.target.value === 'Create List') {

      let inputField = document.createElement('input')

      inputField.id = listTitle
      inputField.placeholder = 'Enter list title'

      inputField.addEventListener('focusout', async (e) => {

        let value = e.target.value
        await submitChange(taskId, 'listId', value)
      })
      inputField.addEventListener('keyup', async (e) => {
        if (e.key === 'Enter') {
          let value = e.target.value
          await submitChange(taskId, 'listId', value)
        }
      })

      editContainer.replaceChild(inputField, selectField)

      inputField.focus();
    } else {
      submitChange(taskId, 'listId', e.target.value)
    }
  })
}

const createListOption = (list) => {
  let option = document.createElement('option')
  option.value = list.id;
  option.innerText = list.title
}

const createInputField = (editContainer) => {
  let taskId = parseInt(document.querySelector('.task-details__task-id').innerText, 10)
  let editField = editContainer.querySelector('.editField')
  let inputField = document.createElement('input')
  inputField.value = editField.innerText
  inputField.id = editField.className.split(' ')[0].slice(19)
  inputField.classList.add(editField.className.split(' ')[0])

  inputField.addEventListener('focusout', async (e) => {
    await submitChange(taskId, inputField.id, inputField.value)
  })
  inputField.addEventListener('keyup', async (e) => {
    if (e.key === 'Enter') {
      await submitChange(taskId, inputField.id, inputField.value)
    }
  })

  editContainer.replaceChild(inputField, editField)

  inputField.focus();
}

const submitChange = async (listId, property, value) => {

  console.log(listId, property, value)



  if (value === 'none' || value === '' || value === '0') value = null;

  let task = await updateTask(listId, property, value)


  reloadTaskList();
  displayDetails(task)

}

const updateTask = async (listId, property, value) => {
  let _csrf = document.querySelector('#csrf').value

  let body = {
    property: value,
    _csrf
  }

  let options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }

  let res = await fetch(`/tasks/${listId}`, options)
  if (!res.ok) alert('there was an error updating!')
  return await res.json();
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

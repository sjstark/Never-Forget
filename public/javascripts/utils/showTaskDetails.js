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

  const detailsDiv = document.querySelector('.details')
  const taskIdEl = document.querySelector('.task-details__task-id')

  let editFields = document.querySelectorAll('.editField')
  editFields.forEach( el => {
    el.remove();
  })

  let oldInputs = document.querySelectorAll('.kill-me')
  oldInputs.forEach( el => {
    el.remove();
  })


  // const taskTitleEl = document.querySelector('.task-details__task-title')
  const taskTitleEl = document.createElement('span')
  taskTitleEl.classList.add('task-details__task-title')
  taskTitleEl.classList.add('editField')
  document.querySelector('#task-title-edit').prepend(taskTitleEl)


  // const dueDateField = document.querySelector('.task-details__task-dueDate')
  const dueDateField = document.createElement('span')
  dueDateField.classList.add('task-details__task-dueDate')
  dueDateField.classList.add('editField')
  document.querySelector('#task-dueDate-edit').prepend(dueDateField)

  // const estimateField = document.querySelector('.task-details__task-estimate')
  const estimateField = document.createElement('span')
  estimateField.classList.add('task-details__task-estimate')
  estimateField.classList.add('editField')
  document.querySelector('#task-estimate-edit').prepend(estimateField)

  // const listTitleField = document.querySelector('.task-details__task-listTitle')
  const listTitleField = document.createElement('span')
  listTitleField.classList.add('task-details__task-listTitle')
  listTitleField.classList.add('editField')
  document.querySelector('.listContainer').prepend(listTitleField)

  const isCompleteField = document.querySelector('.isComplete-checkbox')
  // const isCompleteField = document.createElement('span')
  // isCompleteField.classList.add('task-details__task-title')
  // isCompleteField.classList.add('editField')
  // document.querySelector('#task-title-edit').prepend(isCompleteField)

  taskIdEl.innerText = task.id

  taskTitleEl.innerText = task.title

  dueDateField.innerText = task.dueDate ? formatISODatetoString(task.dueDate) : "none"
  estimateField.innerText = task.estimate ? task.estimate : "none"
  listTitleField.innerText = task.listId ? task.listId : "none"

  isCompleteField.checked = task.isComplete ? true : false;


  createInputEventListeners()

  if (!detailsDiv.className.includes('details--shown')) {
    detailsDiv.classList.add('details--shown')
  }

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

const createInputEventListeners = () => {
  let editContainers = document.querySelectorAll('.editContainer')
  let listContainer = document.querySelector('.listContainer')
  let isCompleteContainer = document.querySelector('.isComplete-container')

  editContainers.forEach( container => {

    container.onclick = handleClickEvent
  })
}

const handleClickEvent = (e) => {
  e.stopPropagation()
  //get final target in case of bubbling

  // let key = e.target.className.split(' ')[0].slice(19)

  // let target = document.querySelector(`.editContainer#task-${key}-edit`)

  let target = e.target
  while (target !== document) {
    if (target.className.includes('editContainer')) {
      // Want target to equal div that is edit container above
      console.log('creating input for:', target)
      createInputField(target)
      return
    }

    target = target.parentElement
  }

}

const formatISODatetoString = (date) => {
  date = new Date(date)
  let dt = date.getDate()
  if (dt < 10) {
    dt = '0' + dt
  }

  let month = date.getMonth() + 1;
  if (month < 10) {
    month = '0' + month
  }

  return month + '/' + dt + '/' + date.getFullYear()
}

const formatStringtoISODate = (date) => {
  let arr = date.split('/')

  let d = new Date(arr[2], arr[0] - 1, arr[1])

  return d
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
  let taskIdEl = document.querySelector('.task-details__task-id')
  let taskId = taskIdEl.innerHTML
  let editField = editContainer.querySelector('.editField')
  let inputField = document.createElement('input')

  inputField.value = editField.innerText
  inputField.id = editField.className.split(' ')[0].slice(19)
  inputField.classList.add(editField.className.split(' ')[0])
  inputField.classList.add('kill-me')

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

const submitChange = async (taskId, property, value) => {

  if (value === 'none' || value === '' || value === '0') value = null;

  if (property === 'dueDate') value = formatStringtoISODate(value)

  let task = await updateTask(taskId, property, value)



  reloadTaskList();
  displayDetails(task)

}

const updateTask = async (taskId, property, value) => {
  let _csrf = document.querySelector('#csrf').value

  let body = {
    _csrf
  }

  body[property] = value;

  let options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }

  let res = await fetch(`/tasks/${taskId}`, options)
  if (!res.ok) alert('there was an error updating!')

  let resBody = await res.json();

  return resBody.task
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

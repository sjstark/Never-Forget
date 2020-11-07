import {reloadTaskList} from './reloadTaskList.js'
import { getLists, getListId, getListTitle } from './list-utils.js'

export const showTaskDetails = async (taskId) => {

  let task = await getTaskById(taskId)

  displayDetails(task)

  const closeButton = document.querySelector('.close-button')
  const deleteButton = document.querySelector('.task-details__delete-button')

  closeButton.onclick = (e) => {
    e.stopPropagation();
    const detailsDiv = document.querySelector('.details')
    detailsDiv.classList.remove('details--shown')
  }

  deleteButton.onclick = async (e) => {
    if (confirm(`Are you sure you'd like to delete this task?\nTask Title: ${task.title}`)) {
      await deleteTask(taskId)

      reloadTaskList()

      document.querySelector('.details').classList.remove('details--shown')
    }
  }

}


const displayDetails = async (task) => {

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

  // console.log(`\nRendering task:\n`, task)

  taskIdEl.innerText = task.id

  taskTitleEl.innerText = task.title

  dueDateField.innerText = task.dueDate ? formatISODatetoString(task.dueDate) : "none"
  estimateField.innerText = task.estimate ? task.estimate : "none"

  listTitleField.innerText = task.listId ? await getListTitle(task.listId) : "none"
  listTitleField.id = task.listId

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
  let taskIdEl = document.querySelector('.task-details__task-id')
  let taskId = taskIdEl.innerHTML
  let editContainers = document.querySelectorAll('.editContainer')
  let listContainer = document.querySelector('.listContainer')
  let isCompleteInput = document.querySelector('.isComplete-checkbox')


  editContainers.forEach( container => {

    container.onclick = handleClickEvent
  })

  isCompleteInput.onclick = () => submitChange(taskId, 'isComplete', isCompleteInput.checked)

  listContainer.onclick = handleListClickEvent
}

const handleListClickEvent = (e) => {
  e.stopPropagation()
  //get final target in case of bubbling

  let target = e.target
  while (target !== document) {
    if (target.className.includes('listContainer')) {
      // Want target to equal div that is edit container above
      // console.log('creating input for:', target)
      createListDropdown(target)
      return
    }

    target = target.parentElement
  }

}

const handleClickEvent = (e) => {
  e.stopPropagation()
  //get final target in case of bubbling

  let target = e.target
  while (target !== document) {
    if (target.className.includes('editContainer')) {
      // Want target to equal div that is edit container above
      // console.log('creating input for:', target)
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
  listContainer.onclick = null;

  let editField = listContainer.querySelector('.editField')
  let selectField = document.createElement('select')
  // console.log('field:', editField)

  // console.log(selectField)
  selectField.classList.add('kill-me')
  let lists = await getLists();

  let nullOption = document.createElement('option')
  nullOption.value = 'null';
  nullOption.innerText = 'none'
  selectField.appendChild(nullOption)

  lists.forEach( list => {
    selectField.appendChild(createListOption(list))
  })

  selectField.value = editField.id

  // let newListOption = document.createElement('option')
  // newListOption.value = 'NEWLIST';
  // newListOption.innerText = 'Create List'
  // selectField.appendChild(newListOption)


  selectField.addEventListener('change', async (e) => {
    let taskIdEl = document.querySelector('.task-details__task-id')
    let taskId = taskIdEl.innerHTML

    // if (e.target.value === 'Create List') {

    //   let inputField = document.createElement('input')

    //   inputField.id = listTitle
    //   inputField.placeholder = 'Enter list title'

    //   inputField.addEventListener('focusout', async (e) => {

    //     let value = e.target.value
    //     await submitChange(taskId, 'listId', value)
    //   })
    //   inputField.addEventListener('keyup', async (e) => {
    //     if (e.key === 'Enter') {
    //       let value = e.target.value
    //       await submitChange(taskId, 'listId', value)
    //     }
    //   })

    //   // listContainer.replaceChild(inputField, selectField)

    //   inputField.focus();
    // } else {
      await submitChange(taskId, 'listId', e.target.value)
    // }
  })

  listContainer.replaceChild(selectField, editField)
}

const createListOption = (list) => {
  let option = document.createElement('option')
  option.value = list.id;
  option.innerText = list.title
  return option
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

  console.log(taskId, inputField.id, inputField.value)
  console.log(typeof inputField.value)

  inputField.addEventListener('focusout', async (e) => {
    //ADD VALIDATOR FUNCTION HERE


    let isValidOrErrors = validateCreateInputField(inputField.id, parseInt(inputField.value,10))

    if (isValidOrErrors === true) {
      await submitChange(taskId, inputField.id, inputField.value)
    } else {
      inputFieldErrors(isValidOrErrors)
    }


    
  })
  inputField.addEventListener('keyup', async (e) => {
    if (e.key === 'Enter') {
      let isValidOrErrors = validateCreateInputField(inputField.id, inputField.value)

      if (isValidOrErrors === true) {
        await submitChange(taskId, inputField.id, inputField.value)
      } else {
        inputFieldErrors(isValidOrErrors)
      }
    }
  })

  editContainer.replaceChild(inputField, editField)

  inputField.focus();
}


const validateCreateInputField = (inputFieldId, inputFieldValue) => {
  //Returns true if valid, returns the list of errors if invalid
  const errors = []
  const regexDate = new RegExp('^[0-9]{2}/[0-9]{2}/[0-9]{4}$')
  
  //Checks to see if due date is a valid date
  if (inputFieldId === 'dueDate') {
    if (regexDate.test(inputFieldValue) || inputFieldValue === 'none') {
      // continue
    } else {
      errors.push("You must format your date to be mm/dd/yyyy")
    }
  }

  //Checks to see if estimate is a valid number and not below zero
  if (inputFieldId === 'estimate') {
    if (Number.isInteger(inputFieldValue) && inputFieldValue >= 0) {
      // continue
    } else {
      errors.push("You must provide a valid number and cannot be below zero")
    }
  }

  if (errors.length > 0) {
    return errors
  } else {
    return true
  }

}


const inputFieldErrors = (errors) => {
  console.log(errors)

  //If errors, then make error div appear with error message and 
  //have it dissapear 

  let errorDiv = document.querySelector('.task-details__errors');

  for (let i = 0; i < errors.length; i++) {
    let errorMessage = document.createTextNode(errors[i])
    errorDiv.appendChild(errorMessage)

  }

  errorDiv.classList.add('task-details__errors--shown');

  setTimeout(()=> {
    errorDiv.classList.remove('task-details__errors--shown')
    errorDiv.innerHTML = ''

  },5000)
}


const submitChange = async (taskId, property, value) => {

  if (value === 'none' || value === '' || value === '0') value = null;

  if (property === 'dueDate' && value) value = formatStringtoISODate(value)

  if (property === 'listId' && value) {value = parseInt(value, 10)}

  // }

  let task = await updateTask(taskId, property, value)



  reloadTaskList();
  displayDetails(task)

}

const updateTask = async (taskId, property, value) => {
  let _csrf = document.querySelector('#csrf').value

  let body = {
    _csrf
  }

  // console.log(`Setting ${property} to ${value}`)
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

  // console.log(`Update on ${taskId}'s ${property} to ${value} returned: ${resBody}`)
  // console.log(resBody)

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

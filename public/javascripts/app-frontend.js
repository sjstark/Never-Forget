import {reloadTaskList} from "./utils/reloadTaskList.js"

//import {treeView, highlighting, selector }from "./menufrontend.js"

document.addEventListener('DOMContentLoaded', async () => {

  localStorage.setItem('never-forget-currentList', null)
  localStorage.setItem('never-forget-viewIncomplete', 1)

  /*
  treeView();
  highlighting();
  selector(reloadTaskList);
  */

/******************************************************************************/
/********************* GET ALL TASKS FOR USER ON LOAD *************************/
/******************************************************************************/

  reloadTaskList();

/******************************************************************************/
/********************** ADD TASK CREATE FUNCTIONALITY *************************/
/******************************************************************************/

  const taskInput = document.querySelector('#taskInput')
  const taskButton = document.querySelector('#add-task')
  const taskDueDate = document.querySelector('.task-add__due-date')
  const taskListAdd = document.querySelector('.task-add__list')
  const taskEstimate = document.querySelector('.task-add__estimate')
  const errorContainer = document.querySelector('.task-add__errors-container')
  const _csrf = document.querySelector('#csrf').value

  taskDueDate.addEventListener('click', async (e) => {
    (e).stopPropagation();
    taskInput.value+=" ^"
    taskInput.focus()
    checkInputs()
  })

  taskListAdd.addEventListener('click', async (e) => {
    (e).stopPropagation();
    taskInput.value+=" #"
    taskInput.focus()
    checkInputs()
  })

  taskEstimate.addEventListener('click', async (e) => {
    (e).stopPropagation();
    taskInput.value+=" ="
    taskInput.focus()
    checkInputs()
  })

  taskInput.addEventListener('input', checkInputs)

  taskButton.addEventListener('click', async (e) => {

    e.preventDefault();


    let input = taskInput.value;
    errorContainer.innerHTML = ''

    if (!input) {
      return
    }
    let parameters

    parameters = parseTaskInput(input)

    const errors = await validateInput(parameters)

    if (errors.length > 0) {

      let errorsUL = document.createElement('ul')
      errorsUL.classList.add('task-add__errors')

      errors.forEach(error => {
        let errorLI = document.createElement('li')
        errorLI.innerHTML = error
        errorsUL.appendChild(errorLI)
      })
      errorContainer.appendChild(errorsUL)
      return;
    }
    else{
      let listId = null
      if (parameters.listTitle) {
        listId = await getListId(parameters.listTitle)
      }

      let body = {
        title: parameters.title,
        listId,
        estimate: parameters.estimate,
        dueDate: parameters.dueDate,
        _csrf
      }

      const options = {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json"
        },
        method: 'POST'
      }

      try {
        const res = await fetch('/tasks', options)
        taskInput.value = '';

        reloadTaskList();
        checkInputs();

      } catch (e) {
        console.error(e)
        return
      }

    }
  })



})



/******************************************************************************/
/***************************** PARSE TASK INPUT *******************************/
/******************************************************************************/


/*
    //Split on '^' for Due Date
    / *\^((0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/(20)\d\d) * /g

    //Split on '#' for List
    / #(\d+) * /g

    //Split on '=' for Estimate
    / =(\d+) * /g

    // input = 'Here is my task ^11/2/2020 #2 =30'
*/

const parseTaskInput = (input) => {

  const dueDatePatt = / *\^((0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/(20)\d\d)/g
  const listPatt = / #(\w+)/g
  const estimatePatt = / =(\d+)/g

  let parameters = {}

  if (input.includes('^')){
    let dueDateExp, dueDate
    try{
      [dueDateExp, dueDate] = dueDatePatt.exec(input)
      parameters.dueDate = dueDate
      input = input.replace(dueDateExp, '')
    }
    catch (e) {
      parameters.dueDate = false
    }
  }
  if (input.includes('#')){
    try {
      let [listExp, listTitle] = listPatt.exec(input)
      parameters.listTitle = listTitle
      input = input.replace(listExp, '')
    } catch (e) {
      parameters.listTitle = false
    }
  }
  if (input.includes('=')){
    try {
      let [estimateExp, estimate] = estimatePatt.exec(input)
      parameters.estimate = estimate
      input = input.replace(estimateExp, '')
    } catch (e) {
      parameters.estimate = false
    }

  }

  parameters.title = input;

  return parameters
}

/******************************************************************************/
/***************************** FLOATING PROMPTS *******************************/
/******************************************************************************/

const addDueDatePrompt = () => {
  const inputContainer = document.querySelector('.task-add__input-container')

  let dueDatePrompt = document.createElement('div')

  dueDatePrompt.classList.add('task-add__input-prompt')
  dueDatePrompt.innerText = 'Please provide a date in MM/DD/YYYY format.'

  inputContainer.appendChild(dueDatePrompt)
}

const addEstimatePrompt = () => {
  const inputContainer = document.querySelector('.task-add__input-container')

  let estimatePrompt = document.createElement('div')

  estimatePrompt.classList.add('task-add__input-prompt')
  estimatePrompt.innerText = 'Please provide number of minutes task is estimated to take.'

  inputContainer.appendChild(estimatePrompt)
}

const addListPrompt = async () => {
  let lists = await getLists()



  const inputContainer = document.querySelector('.task-add__input-container')

  let listPrompt = document.createElement('div')


  listPrompt.classList.add('task-add__input-prompt')

  if (lists.length === 0) {
    listPrompt.innerText = 'Type in the name for a new list!'
  }

  lists.forEach(list => {
    listPrompt.appendChild(makeListOption(list))
  })

  inputContainer.appendChild(listPrompt)
}

const makeListOption = (list) => {
  let listId = list.id
  let title = list.title

  let listEl = document.createElement('div')
  listEl.id = `listOption-${listId}`;
  listEl.classList.add('task-add__input-option')

  listEl.innerText = title

  listEl.addEventListener('click', (e) => {
    e.stopPropagation()
    taskInput.value += e.target.innerText + ' '
    checkInputs();
  })

  return listEl
}

const removePrompts = () => {
  const inputContainer = document.querySelector('.task-add__input-container')

  while (inputContainer.childNodes.length > 2) {
    inputContainer.removeChild(inputContainer.lastChild)
  }
}

const checkInputs = () => {
  let input = taskInput.value;

  const listPatt = /( #(\w*))$/
  const estimatePatt = /( =(\d*))$/
  const dueDatePatt =  /( \^([\d\/]*))$/

  removePrompts();
  if (dueDatePatt.test(input)) {
    addDueDatePrompt();
  } else if (estimatePatt.test(input)) {
    addEstimatePrompt();
  } else if (listPatt.test(input)) {
    addListPrompt()
  }
}

/******************************************************************************/
/***************************** VALIDATE INPUTS ********************************/
/******************************************************************************/

const validateInput = async (input) => {
  const dueDatePatt = /((0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/(20)\d\d)/
  const listPatt = /(\w+)/
  const estimatePatt = /(\d+)/

  const errors = [];

  if (!input.title) {
    errors.push('Please provide a valid task at the start of the input.')
  }

  if (input.dueDate!== undefined && !dueDatePatt.test(input.dueDate)) {
    errors.push('Please make sure date is in MM/DD/YYYY format')
  }

  if (input.estimate !== undefined && !estimatePatt.test(input.estimate)) {
    errors.push('Please make sure to provide estimate in integer of minutes. (30 minutes would be "30")')
  }
  if (input.listTitle !== undefined ) {
    if (input.listTitle === false || !listPatt.test(input.listTitle)) {
      errors.push('Please provide title of list.')
    } else {
      let lists = await getLists()

      let listTitles = lists.map(list => list.title);

      if (!listTitles.includes(input.listTitle)) {
        await createNewList(input.listTitle)
      }
    }
  }

  return errors

}


/******************************************************************************/
/***************************** LIST FUNCTIONS *********************************/
/******************************************************************************/

const createNewList = async (title) => {
  // console.log('\n Attempting to create new list')
  let body = {
    title: title,
    _csrf: document.querySelector('#csrf').value
  }

  // console.log('list body:', body)

  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
  try {
    let res = await fetch('/lists', options)
    if (!res.ok) throw res
    // else console.log('success in posting?')
  } catch (err) {
    // console.log('hit error when creating list')
    console.error(err)
  }
}


const getListId = async (listTitle) => {
  let lists = await getLists();

  for (let i = 0; i < lists.length; i++) {
    let list = lists[i];
    if (list.title === listTitle) {
      return list.id
    }
  }
}

const getLists = async () => {
  let res = await fetch('/lists')
  let body = await res.json();
  let lists = body.allLists

  return lists;
}

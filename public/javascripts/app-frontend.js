document.addEventListener('DOMContentLoaded', async () => {

/******************************************************************************/
/********************* GET ALL TASKS FOR USER ON LOAD *************************/
/******************************************************************************/

  reloadTaskList();
  let lists = getLists()

/******************************************************************************/
/********************** ADD TASK CREATE FUNCTIONALITY *************************/
/******************************************************************************/

  const taskInput = document.querySelector('#taskInput')
  const taskButton = document.querySelector('#add-task')
  const taskDueDate = document.querySelector('.task-add__due-date')
  const taskListAdd = document.querySelector('.task-add__list')
  const taskEstimate = document.querySelector('.task-add__estimate')

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

    if (!input) {
      return
    }

    // parameters = {title, listTitle, estimate, dueDate}

    let parameters = parseTaskInput(input)

    let errors = await validateInput(parameters)

    console.log('errors going into if', errors)
    if (errors.length > 0) {
      console.error(errors)
      return;
    } else{
      let body = {
        title: parameters.title,
        listId: getListId(parameters.listTitle),
        estimate: parameters.estimate,
        dueDate: parameters.dueDate
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
        if (!res.ok) {
          throw res
        }
        taskInput.value = '';

        reloadTaskList();

      } catch (e) {
        console.log('hit!')
        console.error(e)
        return
      }

    }
  })



})


/******************************************************************************/
/************************* BUILD TASK HTML ELEMENT ****************************/
/******************************************************************************/

const createTaskItem = (task) => {
  let taskItem = document.createElement('div')
  taskItem.classList.add('task-list__task-item')
  taskItem.id = `Task-${task.id}`
  taskItem.innerHTML = `
  <div class="task-list__task-bar"></div>
  <div class="task-list__task-select"></div>
  <span class="task-list__task-title">${task.title}</span>`


  return taskItem
}


const reloadTaskList = async (listId = null) => {
  const taskList = document.querySelector('.task-list__tasks')

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

const getLists = () => {
  // let res = await fetch('/lists')
  // let body = await res.json();
  // let lists = body.lists

  //lists for testing
  let lists = [
    {
      "listId": 2,
      "List": {
        "title": "Personal"
      }
    },
    {
      "listId": 3,
      "List": {
        "title": "Work"
      }
    },
  ]

  return lists;
}

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

  if (/\^(1-9\/)+/g.test(input)){
    let [dueDateExp, dueDate] = dueDatePatt.exec(input)
    parameters.dueDate = dueDate
    input = input.replace(dueDateExp, '')
  }
  if (/#(\d+)/g.test(input)){
    let [listExp, listTitle] = listPatt.exec(input)
    parameters.listTitle = listTitle
    input = input.replace(listExp, '')
  }
  if (/=(\d+)/g.test(input)){
    let [estimateExp, estimate] = estimatePatt.exec(input)
    parameters.estimate = estimate
    input = input.replace(estimateExp, '')

  }

  parameters.title = input;

  console.log('params', parameters)

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
  let lists = getLists()

  const inputContainer = document.querySelector('.task-add__input-container')

  let listPrompt = document.createElement('div')


  listPrompt.classList.add('task-add__input-prompt')

  lists.forEach(list => {
    listPrompt.appendChild(makeListOption(list))
  })

  inputContainer.appendChild(listPrompt)
}

const makeListOption = (list) => {
  let listId = list.id
  let title = list.List.title

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

  while (inputContainer.childNodes.length > 1) {
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
    if (input.listTitle === '' || !listPatt.test(input.listTitle)) {
      errors.push('Please provide title of list.')
    } else {
      let lists = getLists()

      let listTitles = lists.map(list => list.List.title);

      if (!listTitles.includes(input.listTitle)) {
        await createNewList(input.listTitle)
      }
    }
  }

  console.log(errors)

  return errors

}

const createNewList = async (title) => {
  let body = {
    title: title
  }

  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body
  }

  let res = await fetch('/lists', options).catch(e=>alert(e))
}


const getListId = (listTitle) => {
  let lists = getLists();

  for (let i = 0; i < lists.length; i++) {
    let list = lists[i];
    if (list.List.title === listTitle) {
      return list.id
    }
  }
}

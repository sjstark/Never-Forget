document.addEventListener('DOMContentLoaded', async () => {

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

  taskDueDate.addEventListener('click', async (e) => {
    (e).stopPropagation();
    taskInput.value+=" ^"
  })

  taskListAdd.addEventListener('click', async (e) => {
    (e).stopPropagation();
    taskInput.value+=" #"
  })

  taskEstimate.addEventListener('click', async (e) => {
    (e).stopPropagation();
    taskInput.value+=" ="
  })

  taskInput.addEventListener('input', async (e) => {
    let input = taskInput.value;

    const listIdPatt = /( #(\d*))$/
    const estimatePatt = /( =(\d*))$/
    const dueDatePatt =  /( \^([\d\/]*))$/

    removePrompts();
    if (dueDatePatt.test(input)) {
      addDueDatePrompt();
    } else if (estimatePatt.test(input)) {
      addEstimatePrompt();
    }
  })

  taskButton.addEventListener('click', async (e) => {

    e.preventDefault();

    let input = taskInput.value;
    // parameters = {title, listId, estimate, dueDate}
    let parameters = parseTaskInput(input)


    let body = {
      title: parameters.title,
      listId: parameters.listId,
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

    const task = await fetch('/tasks', options)
    taskInput.value = ''

    reloadTaskList();
  })



})


/******************************************************************************/
/************************* BUILD TASK HTML ELEMENT ****************************/
/******************************************************************************/

const createTaskItem = (task) => {
  let taskItem = document.createElement('div')
  taskItem.classList.add('task-list__task-item')

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
  const listPatt = / #(\d+)/g
  const estimatePatt = / =(\d+)/g

  let [dueDateExp, dueDate] = dueDatePatt.exec(input)
  let [listExp, listId] = listPatt.exec(input)
  let [estimateExp, estimate] = estimatePatt.exec(input)

  let title = input.replace(dueDateExp, '').replace(listExp, '').replace(estimateExp, '')

  return{title, dueDate, listId, estimate}
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

const addListIdPrompt = async () => {
  const inputContainer = document.querySelector('.task-add__input-container')

  let listIdPrompt = document.createElement('div')

  // let res = await fetch('/lists')
  // let body = await res.json();
  // let lists = body.lists

  //lists for testing
  let lists = [
    {
      id: 12,
      title: 'Peronsal'
    },
    {
      id: 14,
      title: 'Work'
    },
  ]

  listIdPrompt.classList.add('task-add__input-prompt')

  lists.forEach(list => {
    listIdPrompt.appendChild(makeListOption(list))
  })

  inputContainer.appendChild(listIdPrompt)
}



const removePrompts = () => {
  const inputContainer = document.querySelector('.task-add__input-container')

  while (inputContainer.childNodes.length > 1) {
    inputContainer.removeChild(inputContainer.lastChild)
  }
}

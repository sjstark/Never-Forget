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


const reloadTaskList = async () => {
  const taskList = document.querySelector('.task-list__tasks')

  let res = await fetch('/tasks')
  let body = await res.json();

  let tasks = body.allTasks

  taskList.innerHTML = ''

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

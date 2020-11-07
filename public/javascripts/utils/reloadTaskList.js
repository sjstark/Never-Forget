import { showTaskDetails } from "./showTaskDetails.js";
import { updateTaskSummary } from "./updateTaskSummary.js";
import { handleChecking } from "./handle-task-checkbox.js";

/******************************************************************************/
/************************* BUILD TASK HTML ELEMENT ****************************/
/******************************************************************************/

export const reloadTaskList = async () => {
  const taskList = document.querySelector(".task-list__tasks");

  let listId = localStorage.getItem("never-forget-currentList")
    ? localStorage.getItem("never-forget-currentList")
    : null;
  if (listId === "null") listId = null;

  let route = "/tasks";
  if (listId) {
    if (listId.startsWith('search:')){
      let searchInput = listId.slice(7)
      route = `/tasks/search?includes=${encodeURI(searchInput)}`
    } else {
      route = `/lists/${listId}`
    }
  }

  let res = await fetch(route);
  let body = await res.json();

  let tasks = body.allTasks;

  //update task summary
  updateTaskSummary(tasks);

  let viewIncomplete = parseInt(
    localStorage.getItem("never-forget-viewIncomplete"),
    10
  );

  if (viewIncomplete) {

    tasks = tasks.filter((task) => {
      if (!task.isComplete) return true;
      else return false;
    });
  } else {

    tasks = tasks.filter((task) => {
      if (task.isComplete) return true;
      else return false;
    });
  }

  if (tasks.length !== 0) {

    // Build HTML Elements for all tasks

    taskList.innerHTML = "";

    tasks.forEach((task) => {
      taskList.appendChild(createTaskItem(task));

    });

  } else {

    // Create Empty Task List Element

    taskList.innerHTML = "";

    let emptyListTask = document.createElement('div')

    emptyListTask.classList.add("task-list__empty-task-item");


    emptyListTask.innerHTML = `There are no tasks in this list!`;

    taskList.appendChild(emptyListTask)
  }

  addFillerTasks()

};

export const addFillerTasks = () => {
  const taskList = document.querySelector(".task-list__tasks");
  let taskFillContainer = document.querySelector('.task-list__placeholder')
  let taskFill = document.createElement('div')
  taskFill.className = "task-list__task-item-placeholder"

  taskFillContainer.innerHTML = ''

  if (taskList.offsetHeight < taskList.parentElement.offsetHeight) {
    let difference = () => taskList.parentElement.offsetHeight - (taskList.offsetHeight + taskFillContainer.offsetHeight)
    while (difference() > 0) {
      taskFillContainer.innerHTML += taskFill.outerHTML
    }
  } else {
    for (let i = 0; i < 5; i++) {
      taskFillContainer.innerHTML += taskFill.outerHTML
    }
  }
}

const createTaskItem = (task) => {
  let taskItem = document.createElement("div");
  taskItem.classList.add("task-list__task-item");
  taskItem.id = `Task-${task.id}`;
  taskItem.innerHTML = `
  <div class="task-list__task-bar"></div>
  <input type="checkbox">
  <span class="task-list__task-title">${task.title}</span>`;

  let checkBox = taskItem.querySelector('input[type = "checkbox"]')

  handleChecking(checkBox, task)

  taskItem.addEventListener('click', (e) => {

    e.stopPropagation();

    let taskDiv
    if (e.target.className !== 'task-list__task-item') {
      taskDiv = e.target.parentElement
    } else {
      taskDiv = e.target
    }

    let taskId = taskDiv.id.slice(5)

    showTaskDetails(taskId)
  })
  return taskItem
}

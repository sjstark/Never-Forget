import {
  countTotalTasks,
  countListTasks,
  emphasisText,
  loadLists,
  treeView,
  addLists,
} from "./lists-menu.js";

import { reloadTaskList, addFillerTasks } from "./utils/reloadTaskList.js";
import { createNewList, getListId, getLists } from "./utils/list-utils.js";

//import {treeView, highlighting, selector }from "./menufrontend.js"

document.addEventListener("DOMContentLoaded", async () => {
  window.addEventListener('resize', addFillerTasks )

  localStorage.setItem("never-forget-currentList", null);
  localStorage.setItem("never-forget-viewIncomplete", 1);

  /******************************************************************************/
  /********************* GET ALL TASKS FOR USER ON LOAD *************************/
  /******************************************************************************/

  reloadTaskList();

  //event listeners to toggle between incomplete vs complete views:

  const incompleteViewContainer = document.querySelector(
    ".menubar-item__incomplete"
  );
  const completeViewContainer = document.querySelector(
    ".menubar-item__complete"
  );

  incompleteViewContainer.addEventListener("click", (event) => {
    if (completeViewContainer.classList.contains("active")) return;

    completeViewContainer.classList.remove("menubar-item--active");
    incompleteViewContainer.classList.add("menubar-item--active");
    localStorage.setItem("never-forget-viewIncomplete", 1);
    reloadTaskList();
  });

  completeViewContainer.addEventListener("click", (event) => {
    if (incompleteViewContainer.classList.contains("active")) return;

    incompleteViewContainer.classList.remove("menubar-item--active");
    completeViewContainer.classList.add("menubar-item--active");
    localStorage.setItem("never-forget-viewIncomplete", 0);
    reloadTaskList();
  });

  /******************************************************************************/
  /********************** ADD TASK CREATE FUNCTIONALITY *************************/
  /******************************************************************************/

  const taskInput = document.querySelector("#taskInput");
  const taskButton = document.querySelector("#add-task");
  const taskDueDate = document.querySelector(".task-add__due-date");
  const taskListAdd = document.querySelector(".task-add__list");
  const taskEstimate = document.querySelector(".task-add__estimate");
  const errorContainer = document.querySelector(".task-add__errors-container");
  const _csrf = document.querySelector("#csrf").value;

  taskDueDate.addEventListener("click", async (e) => {
    e.stopPropagation();
    taskInput.value += " ^";
    taskInput.focus();
    checkInputs();
  });

  taskListAdd.addEventListener("click", async (e) => {
    e.stopPropagation();
    taskInput.value += " #";
    taskInput.focus();
    checkInputs();
  });

  taskEstimate.addEventListener("click", async (e) => {
    e.stopPropagation();
    taskInput.value += " =";
    taskInput.focus();
    checkInputs();
  });

  taskInput.addEventListener("input", checkInputs);

  taskButton.addEventListener("click", async (e) => {
    e.preventDefault();

    let input = taskInput.value;
    errorContainer.innerHTML = "";

    if (!input) {
      return;
    }
    let parameters;

    parameters = parseTaskInput(input);


    const errors = await validateInput(parameters);


    if (errors.length > 0) {
      let errorsUL = document.createElement("ul");
      errorsUL.classList.add("task-add__errors");

      errors.forEach((error) => {
        let errorLI = document.createElement("li");
        errorLI.innerHTML = error;
        errorsUL.appendChild(errorLI);
      });
      errorContainer.appendChild(errorsUL);
      return;
    } else {
      let listId = null;
      if (parameters.listTitle) {
        listId = await getListId(parameters.listTitle);
      }

      let body = {
        title: parameters.title,
        listId,
        estimate: parameters.estimate,
        dueDate: parameters.dueDate,
        _csrf,
      };

      const options = {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      };

      try {
        const res = await fetch("/tasks", options);
        taskInput.value = "";

        reloadTaskList();
        checkInputs();
        await loadLists();
        emphasisText();
        await countTotalTasks()
        await countListTasks();
      } catch (e) {
        // console.error(e);
        return;
      }
    }
  });

  await loadLists();

  treeView();

  emphasisText();

  await countTotalTasks();

  await countListTasks();
});

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
  const dueDatePatt = /\ *\^((0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/(20)\d\d)/g;
  const listPatt = /#([\w\s]+)/g;
  const estimatePatt = /=(\d+)/g;

  let parameters = {};
  console.log(input)
  if (input.includes("^")) {
    let dueDateExp, dueDate;
    try {
      [dueDateExp, dueDate] = dueDatePatt.exec(input);
      parameters.dueDate = dueDate;
      input = input.replace(dueDateExp, "");
    } catch (e) {
      parameters.dueDate = false;
    }
  }
  console.log(input)
  if (input.includes("#")) {
    try {
      let [listExp, listTitle] = listPatt.exec(input);
      parameters.listTitle = listTitle.trim();
      input = input.replace(listExp, "");
    } catch (e) {
      parameters.listTitle = false;
    }
  }
  if (input.includes("=")) {
    try {
      let [estimateExp, estimate] = estimatePatt.exec(input);
      parameters.estimate = estimate;
      input = input.replace(estimateExp, "");
    } catch (e) {
      parameters.estimate = false;
    }
  }

  parameters.title = input;

  return parameters;
};

/******************************************************************************/
/***************************** FLOATING PROMPTS *******************************/
/******************************************************************************/

const addDueDatePrompt = () => {
  const inputContainer = document.querySelector(".task-add__input-container");

  let dueDatePrompt = document.createElement("div");

  dueDatePrompt.classList.add("task-add__input-prompt");
  dueDatePrompt.innerText = "Please provide a date in MM/DD/YYYY format.";

  inputContainer.appendChild(dueDatePrompt);
};

const addEstimatePrompt = () => {
  const inputContainer = document.querySelector(".task-add__input-container");

  let estimatePrompt = document.createElement("div");

  estimatePrompt.classList.add("task-add__input-prompt");
  estimatePrompt.innerText =
    "Please provide number of minutes task is estimated to take.";

  inputContainer.appendChild(estimatePrompt);
};

const addListPrompt = async () => {
  let lists = await getLists();

  const inputContainer = document.querySelector(".task-add__input-container");

  let listPrompt = document.createElement("div");

  listPrompt.classList.add("task-add__input-prompt");

  if (lists.length === 0) {
    listPrompt.innerText = "Type in the name for a new list!";
  }

  lists.forEach((list) => {
    listPrompt.appendChild(makeListOption(list));
  });

  inputContainer.appendChild(listPrompt);
};

const makeListOption = (list) => {
  let listId = list.id;
  let title = list.title;

  let listEl = document.createElement("div");
  listEl.id = `listOption-${listId}`;
  listEl.classList.add("task-add__input-option");

  listEl.innerText = title;

  listEl.addEventListener("click", (e) => {
    e.stopPropagation();
    let splitInput = taskInput.value.split('#')

    taskInput.value = splitInput[0] + "#" + e.target.innerText + ' '

    taskInput.focus();
    // taskInput.value += e.target.innerText + " ";
    checkInputs();
  });

  return listEl;
};

const removePrompts = () => {
  const inputContainer = document.querySelector(".task-add__input-container");

  while (inputContainer.childNodes.length > 2) {
    inputContainer.removeChild(inputContainer.lastChild);
  }
};

const checkInputs = () => {
  let input = taskInput.value;

  const listPatt = /( #(\w*))$/;
  const estimatePatt = /( =(\d*))$/;
  const dueDatePatt = /( \^([\d\/]*))$/;

  removePrompts();
  if (dueDatePatt.test(input)) {
    addDueDatePrompt();
  } else if (estimatePatt.test(input)) {
    addEstimatePrompt();
  } else if (listPatt.test(input)) {
    addListPrompt();
  }
};

/******************************************************************************/
/***************************** VALIDATE INPUTS ********************************/
/******************************************************************************/

const validateInput = async (input) => {
  const dueDatePatt = /((0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/(20)\d\d)/;
  const listPatt = /([\w\s]+)/;
  const estimatePatt = /(\d+)/;

  const errors = [];

  if (!input.title) {
    errors.push("Please provide a valid task at the start of the input.");
  }

  if (input.dueDate !== undefined && !dueDatePatt.test(input.dueDate)) {
    errors.push("Please make sure date is in MM/DD/YYYY format");
  }

  if (input.estimate !== undefined && !estimatePatt.test(input.estimate)) {
    errors.push(
      'Please make sure to provide estimate in integer of minutes. (30 minutes would be "30")'
    );
  }
  if (input.listTitle !== undefined) {
    if (input.listTitle === false || !listPatt.test(input.listTitle)) {
      errors.push("Please provide title of list.");
    } else {
      let lists = await getLists();

      let listTitles = lists.map((list) => list.title);

      if (!listTitles.includes(input.listTitle)) {
        await createNewList(input.listTitle);
      }
    }
  }

  return errors;
};

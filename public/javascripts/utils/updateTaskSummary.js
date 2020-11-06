// import db from "../../../db/models";
// const { List } = db;

export const updateTaskSummary = async (tasks) => {
  //create and append element for tasks field
  const taskCountContainer = document.querySelector(".task-num");

  let completedTasks = tasks.filter((task) => {
    return task.isComplete;
  });
  let incompleteTasks = tasks.length - completedTasks.length;
  taskCountContainer.innerHTML = incompleteTasks;

  //create and append element for completed field
  const tasksCompletedContainer = document.querySelector(".task-num-completed");

  tasksCompletedContainer.innerHTML = completedTasks.length;

  //create and append element for estimated field
  const estimatedTimeContainer = document.querySelector(".task-time");

  let estimatedTime = 0;
  tasks.forEach((task) => {
    if (!task.isComplete) {
      estimatedTime += task.estimate;
    }
  });

  if (estimatedTime < 99) {
    estimatedTimeContainer.innerHTML = estimatedTime + "min";
  } else {
    //hours with one decimal
    let hours = Math.floor((estimatedTime / 60) * 10) / 10;
    estimatedTimeContainer.innerHTML = `${hours}hrs`;
  }

  //THIS CHANGES LIST TITLE
  let listId = localStorage.getItem("never-forget-currentList");
  let listTitleContainer = document.querySelector(".all-tas");

  console.log("we got here");

  if (listId === "null") {
    listTitleContainer.innerHTML = "All Tasks";
  } else if (listId.startsWith("search:")) {
    listTitleContainer.innerHTML = `Task results for: "${listId.slice(7)}"`;
  } else if (typeof listId === "number") {
    //fetch the user's lists
    const res = await fetch("/lists");
    let resObj = res.json();
    let listArray = resObj.allLists;

    //filter for the targeted list
    const currentList = listArray.filter((list) => {
      return list.id === listId;
    });
    listTitleContainer.innerHTML = currentList.title;
  } else {
    listTitleContainer.innerHTML = "Unkown List";
  }
};

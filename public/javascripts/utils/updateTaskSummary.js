export const updateTaskSummary = (tasks) => {
  //overwrite innerHTML of the incompleted container with the incompleted tasks num
  const taskCountContainer = document.querySelector(".task-num");

  let completedTasks = tasks.filter((task) => {
    return task.isComplete;
  });
  let incompleteTasks = tasks.length - completedTasks.length;
  taskCountContainer.innerHTML = incompleteTasks;

  //overwrite innerHTML of the completed container with the completed tasks num
  const tasksCompletedContainer = document.querySelector(".task-num-completed");

  tasksCompletedContainer.innerHTML = completedTasks.length;

  //overwrite innerHTML of the estimated time container with the estimated time for incomplete tasks
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
};

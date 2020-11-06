export const updateTaskSummary = (tasks) => {
  //create and append element for tasks field
  const taskCountContainer = document.querySelector(".task-count");

  let completedTasks = tasks.filter((task) => {
    return task.isComplete;
  });
  let incompleteTasks = tasks.length - completedTasks.length;
  let incompleteH5 = document.createElement("h5");
  incompleteH5.innerHTML = incompleteTasks;
  taskCountContainer.appendChild(incompleteH5);

  //create and append element for completed field
  const tasksCompletedContainer = document.querySelector(".task-completed");

  let completeH5 = document.createElement("h5");
  completeH5.innerHTML = completedTasks.length;
  tasksCompletedContainer.appendChild(completeH5);

  //create and append element for estimated field

  const estimatedTimeContainer = document.querySelector(".task-time-estimate");

  let estimatedTime = 0;
  tasks.forEach((task) => {
    estimatedTime += task.estimate;
  });

  let timeH5 = document.createElement("h5");
  timeH5.innerHTML = estimatedTime + "min";
  estimatedTimeContainer.appendChild(timeH5);
};

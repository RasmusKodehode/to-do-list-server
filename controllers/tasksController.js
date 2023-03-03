const tasklist = {
  tasks: require("../model/tasks.json"),
  setTasks: function (data) {
    return (this.tasks = data);
  },
};

const getAllTasks = () => {
  if (tasklist.tasks.length === 0) {
    console.log("The to-do list is currently empty");
  } else {
    console.log("The current tasks are:");
    console.log(tasklist.tasks);
  }
};

module.exports = { getAllTasks };

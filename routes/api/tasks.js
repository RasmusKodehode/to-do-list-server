const tasklist = {
  tasks: require("../../model/tasks.json"),
  setTasks: function (data) {
    return (this.tasks = data);
  },
};

const express = require("express");
const router = express.Router();
const fsPromises = require("fs").promises;
const path = require("path");
const tasksController = require("../../controllers/tasksController");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

router.route("/")
  .get(tasksController.getAllTasks)
  .post(tasksController.handleTask)
  .put(tasksController.completedTask)
  .delete(tasksController.deleteTask);

tasksController.printAllTasks();
console.log("Type a new task to create it");
console.log("Type an existing task to complete it");
console.log("type a completed task to delete it");
readline.question("Enter task:\n", async (data) => {
  const input = data;
  if (input) {
    const duplicate = tasklist.tasks.find((item) => {
      return item.taskname === input;
    });
    if (!duplicate) {
      try {
        const newTask = { taskname: input, completed: "no" };
        tasklist.setTasks([...tasklist.tasks, newTask]);
        await fsPromises.writeFile(
          path.join(__dirname, "..", "..", "model", "tasks.json"),
          JSON.stringify(tasklist.tasks)
        );
        process.stdout.write(`success: new task ${input} created\n`);
      } catch (err) {
        process.stderr.write("Message: ", err.message);
      }
    } else {
      try {
        const revisedTasklist = tasklist.tasks;
        for (item of revisedTasklist) {
          if (item.taskname === input) {
            if (item.completed === "no") {
              item.completed = "yes";
              console.log(`task ${input} completed`);
            } else if (item.completed === "yes") {
              const taskIndex = revisedTasklist.indexOf(item);
              const deletedTask = revisedTasklist.splice(taskIndex, 1);
              console.log(`task ${input} deleted`);
            } else {
              process.stderr.write(`message: invalid state\n`);
            }
          }
        }
        tasklist.setTasks(revisedTasklist);
        await fsPromises.writeFile(
          path.join(__dirname, "..", "..", "model", "tasks.json"),
          JSON.stringify(tasklist.tasks)
        );
        process.stdout.write(`Success: task ${input} updated\n`);
      } catch (err) {
        process.stderr.write("Message: ", err.message);
      }
    }
  } else {
    const revisedTasklist = tasklist.tasks;
    tasklist.setTasks(revisedTasklist);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "..", "model", "tasks.json"),
      JSON.stringify(tasklist.tasks)
    );
    process.stderr.write("Message: Type in a task\n");
  }
});

module.exports = router, {tasklist};

const fsPromises = require("fs").promises;
const path = require("path");

const tasklist = {
  tasks: require("../model/tasks.json"),
  setTasks: function (data) {
    return (this.tasks = data);
  },
};

const printAllTasks = () => {
  if (tasklist.tasks.length === 0) {
    console.log("The to-do list is currently empty");
  } else {
    console.log("The current tasks are:");
    console.log(tasklist.tasks);
  }
};

const getAllTasks = (res) => {
  console.log("looking for tasks");
  return res.status(200).json({"message": `The current tasks are ${tasklist.tasks}`});
}

const handleTask = async (req, res) => {
  const task = req.body.inputTask;
  if (!task) {
    console.log("something is wrong");
    return res.status(400).json({"message": "taskname required"});
  }
  const duplicate = tasklist.tasks.find((item) => {
    return item.taskname === task;
  });
  if (!duplicate) {
    try {
      const newTask = {"taskname": task, "completed": "no"};
      tasklist.setTasks([...tasklist.tasks, newTask])
      await fsPromises.writeFile(path.join(__dirname, "..", "model", "tasks.json"), JSON.stringify(tasklist.tasks));
      //console.log(tasklist.tasks);
      res.status(201).json({"Success": `New task ${task} created`});
    }
    catch(err) {
      res.status(500).json({"message": err.message});
    }
  } else {
    try {
      const revisedTasklist = tasklist.tasks;
      let status = "";
      for (item of revisedTasklist) {
        if (item.taskname === task) {
          if (item.completed === "no") {
            item.completed = "yes";
            status = "completed";
          } else {
            const taskIndex = revisedTasklist.indexOf(item);
            console.log(taskIndex);
            const deletedTask = revisedTasklist.splice(taskIndex, 1);
            console.log(deletedTask);
            status = "deleted";
          }
        }
      }
      tasklist.setTasks(revisedTasklist);
      await fsPromises.writeFile(path.join(__dirname, "..", "model", "tasks.json"), JSON.stringify(tasklist.tasks));
      //console.log(tasklist.tasks);
      res.status(201).json({"Success": `${task} ${status}`});
    }
    catch(err) {
      res.status(500).json({"Message": err.message});
    }
  }
}

const createNewTask = async (req, res) => {
  const {"taskname": task, "completed": status} = req.body;
  console.log(req.body);
  if (!task || !status) {
    console.log("something is wrong");
    return res.status(400).json({"message": "taskname and status required"});
  }
  const duplicate = tasklist.tasks.find(item => {
    return item.taskname === task;
  })
  if (duplicate) {
    return res.sendStatus(409);
  }
  try {
    const newTask = {"taskname": task, "completed": status};
    tasklist.setTasks([...tasklist.tasks, newTask])
    await fsPromises.writeFile(path.join(__dirname, "..", "model", "tasks.json"), JSON.stringify(tasklist.tasks));
    console.log(tasklist.tasks);
    res.status(201).json({"Success": `New task ${task} created`});
  }
  catch(err) {
    res.status(500).json({"message": err.message});
  }
}

const completedTask = async (req, res) => {
  const {"taskname": task, "completed": status} = req.body;
  if (!task || !status) {
    return res.status(400).json({"Message": "taskname and status required"});
  }
  const duplicate = tasklist.tasks.find(item => {
    return item.taskname === task;
  })
  if (!duplicate) {
    return res.status(400).json({"Message": "Task does not exist"});
  }
  try {
    const revisedTasklist = tasklist.tasks;
    for (item of revisedTasklist) {
      if (item.taskname === task) {
        item.completed = "yes";
      }
    }
    tasklist.setTasks(revisedTasklist);
    await fsPromises.writeFile(path.join(__dirname, "..", "model", "tasks.json"), JSON.stringify(tasklist.tasks));
    console.log(tasklist.tasks);
    res.status(201).json({"Success": `${task} updated`})
  }
  catch(err) {
    res.status(500).json({"Message": err.message});
  }
}

const deleteTask = async (req, res) => {
  const {"taskname": task, "completed": status} = req.body;
  if (!task || !status) {
    return res.status(400).json({"Message": "Taskname and status required"});
  }
  const duplicate = tasklist.tasks.find(item => {
    return item.taskname === task;
  })
  if (!duplicate) {
    return res.status(400).json({"Message": "Task does not exist"});
  }
  try {
    const revisedTasklist = tasklist.tasks;
    for (item of revisedTasklist) {
      if (item.taskname === task) {
        const taskIndex = revisedTasklist.indexOf(item);
        console.log(taskIndex);
        const deletedTask = revisedTasklist.splice(taskIndex, 1);
        console.log(deletedTask);
      }
    }
    tasklist.setTasks(revisedTasklist);
    await fsPromises.writeFile(path.join(__dirname, "..", "model", "tasks.json"), JSON.stringify(tasklist.tasks));
    console.log(tasklist.tasks);
    res.status(201).json({"Success": `${task} deleted`});
  }
  catch(err) {
    res.status(500).json({"Message": err.message});
  }
}



module.exports = { printAllTasks, getAllTasks, handleTask, createNewTask, completedTask, deleteTask };

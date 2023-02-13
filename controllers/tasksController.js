const tasklist = {
    tasks: require("../model/tasks.json"),
    setTasks: function(data) {
        return this.tasks = data;
    }
}

const fsPromises = require("fs").promises;
const path = require("path");

const getAllTasks = (req, res) => {
    console.log("looking for tasks");
    res.status(200).json({"message": `The current tasks are ${tasklist.tasks}`});
}

const createNewTask = async (req, res) => {
    const {task, status} = req.body;
    if (!task || !status) {
        return res.status(400).json({"message": "taskname and completion status required"});
    }
    const duplicate = tasklist.tasks.find(item => {
        return item.taskname === task;
    })
    if (duplicate) {
        return res.sendStatus(409);
    }
    try {
        const newTask = {"taskname": task, "completed": status};
        tasklist.setTasks([...tasklist.tasks, newTask]);
        await fsPromises.writeFile(
            path.join(__dirname, "..", "model", "tasks.json"),
            JSON.stringify(tasklist.tasks)
        );
        console.log(tasklist.tasks);
        res.status(201).json({"success": `New task ${task} created`});
    }
    catch(err) {
        res.status(500).json({"message": err.message});
    }
}

const completedTask = async (req, res) => {
    const {task, status} = req.body;
    if (!task || !status) {
        return res.status(400).json({"message": "taskname and completion status required"});
    }
    const duplicate = tasklist.tasks.find(item => {
        return item.taskname === task;
    })
    if (!duplicate) {
        return res.status(400).json({"message": "this task doesn't exist, please add it"});
    }
    try {
        const revisedTasklist = tasklist.tasks;
        console.log(revisedTasklist);
        for (item of revisedTasklist) {
            if (item.taskname === task) {
                item.completed = "yes";
            }
        }
        tasklist.setTasks(revisedTasklist);
        await fsPromises.writeFile(
            path.join(__dirname, "..", "model", "tasks.json"),
            JSON.stringify(tasklist.tasks)
        );
        console.log(tasklist.tasks);
        res.status(201).json({"success": `task ${task} updated`});
    }
    catch(err) {
        res.status(500).json({"message": err.message});
    }
}

const deleteTask = async (req, res) => {
    const {task, status} = req.body;
    if (!task || !status) {
        return res.status(400).json({"message": "taskname required"});
    }
    const duplicate = tasklist.tasks.find((item) => {
      return item.taskname === task;
    });
    if (!duplicate) {
        return res.status(400).json({"message": "this task does not exist"});
    }
    try {
        const revisedTasklist = tasklist.tasks;
        console.log(revisedTasklist);
        for (item of revisedTasklist) {
            if (item.taskname === task) {
                const taskIndex = revisedTasklist.indexOf(item);
                console.log(taskIndex);
                const deletedTask = revisedTasklist.splice(taskIndex, 1);
                console.log(deletedTask);
            }
            console.log("looping");
        }
        tasklist.setTasks(revisedTasklist);
        await fsPromises.writeFile(
            path.join(__dirname, "..", "model", "tasks.json"),
            JSON.stringify(tasklist.tasks)
        );
        console.log(tasklist.tasks);
        res.status(201).json({"success": `Task ${task} deleted`})
    }
    catch(err) {
        res.status(500).json({"message": err.messsage});
    }
}

const getOneTask = (req, res) => {
    res.json(
        {
            "taskname": req.params.taskname
        }
    );
}

module.exports = {getAllTasks, createNewTask, completedTask, deleteTask, getOneTask};
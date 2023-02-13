const express = require("express");
const router = express.Router();
const path = require("path");
const tasksController = require("../../controllers/tasksController");


router.route("/")
    .get(tasksController.getAllTasks)
    .post(tasksController.createNewTask)
    .put(tasksController.completedTask)
    .delete(tasksController.deleteTask);

router.route("/:taskname")
    .get(tasksController.getOneTask)

module.exports = router;
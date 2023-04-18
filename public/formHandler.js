async function getTasks() {
    console.log("requesting data");
    const fetchRequest = await fetch("/tasks");
    const fetchData = await fetchRequest.json();
    console.log("data requested");
    return fetchData;
}

async function displayData() {
    const reqList = await getTasks();
    console.log("loading tasks");
    const listOfTasks = document.getElementById("list-of-tasks");
    listOfTasks.innerText = reqList;
}

//displayData();

const form = document.getElementById("task-form");
const input = document.getElementById("input-task");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const task = formData.get("inputTask");
    console.log(task);
    const fetchRequest = await fetch("/tasks", {
      method: "POST",
      headers: { "content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({"inputTask": task}),
    });
    const fetchData = await fetchRequest.json();
    console.log(fetchData);
    const response = document.getElementById("response");
    if (fetchData.Success) {
        response.innerText = fetchData.Success;
    } else {
        response.innerText = fetchData.message;
    }
    input.value = "";
    return fetchData;
})
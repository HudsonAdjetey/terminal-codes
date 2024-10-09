#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
// File path for the tasks
const taskPath = path.join(__dirname, "tasks.json");

// Helper to read the tasks.json file
const readTasksFromFile = async () => {
  if (!fs.existsSync(taskPath)) {
    // If file doesn't exist, create an empty one
    await fs.promises.writeFile(taskPath, JSON.stringify([]), "utf8");
    return [];
  } else {
    // Read and parse JSON from file
    const data = await fs.promises.readFile(taskPath, "utf8");
    return JSON.parse(data);
  }
};

// Helper to write tasks back to tasks.json
const writeTasksToFile = async (tasks) => {
  await fs.promises.writeFile(taskPath, JSON.stringify(tasks, null, 2), "utf8");
};

// Add a new task
const addTask = async (description) => {
  const tasks = await readTasksFromFile();
  const newId = tasks.length
    ? Math.max(...tasks.map((task) => task.id)) + 1
    : 1;

  const newTask = {
    id: newId,
    description,
    status: "todo",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  tasks.push(newTask);
  await writeTasksToFile(tasks);
  console.log(`Task added successfully (ID: ${newId})`);
};

// Update a task description
const updateTask = async (id, newDescription) => {
  const tasks = await readTasksFromFile();
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    console.log(`Task with ID: ${id} not found.`);
    return;
  }

  tasks[taskIndex].description = newDescription;
  tasks[taskIndex].updatedAt = new Date();

  await writeTasksToFile(tasks);
  console.log(`Task ID: ${id} updated successfully.`);
};


// Delete a task
const deleteTask = async (id) => {
  const tasks = await readTasksFromFile();
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    console.log(`Task with ID: ${id} not found.`);
    return;
  }

  tasks.splice(taskIndex, 1);
  await writeTasksToFile(tasks);
  console.log(`Task ID: ${id} deleted successfully.`);
};

// Mark a task as in-progress or done
const updateTaskStatus = async (id, status) => {
  const tasks = await readTasksFromFile();
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    console.log(`Task with ID: ${id} not found.`);
    return;
  }

  tasks[taskIndex].status = status;
  tasks[taskIndex].updatedAt = new Date();

  await writeTasksToFile(tasks);
  console.log(`Task ID: ${id} marked as ${status}.`);
};

// List tasks
const listTasks = async (statusFilter = null) => {
  const tasks = await readTasksFromFile();

  const filteredTasks = statusFilter
    ? tasks.filter((task) => task.status === statusFilter)
    : tasks;

  if (filteredTasks.length === 0) {
    console.log("No tasks found.");
  } else {
    filteredTasks.forEach((task) => {
      console.log(
        `ID: ${task.id}, Description: ${task.description}, Status: ${task.status}, Created At: ${task.createdAt}, Updated At: ${task.updatedAt}`
      );
    });
  }
};

// CLI Command Handling
const command = process.argv[2];
const args = process.argv.slice(3);

(async () => {
  switch (command) {
    case "add":
      if (args[0]) {
        addTask(args[0]);
      } else {
        console.log("Please provide a description for the task.");
      }
      break;

    case "update":
      if (args[0] && args[1]) {
        updateTask(Number(args[0]), args[1]);
      } else {
        console.log("Please provide both the task ID and the new description.");
      }
      break;

    case "delete":
      if (args[0]) {
        deleteTask(Number(args[0]));
      } else {
        console.log("Please provide the task ID to delete.");
      }
      break;

    case "mark-in-progress":
      if (args[0]) {
        updateTaskStatus(Number(args[0]), "in-progress");
      } else {
        console.log("Please provide the task ID to mark as in-progress.");
      }
      break;

    case "mark-done":
      if (args[0]) {
        updateTaskStatus(Number(args[0]), "done");
      } else {
        console.log("Please provide the task ID to mark as done.");
      }
      break;

    case "list":
      if (args[0]) {
        listTasks(args[0]);
      } else {
        listTasks();
      }
      break;

    default:
      console.log(
        "Available commands: add, update, delete, mark-in-progress, mark-done, list."
      );
      break;
  }
})();

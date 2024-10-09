# Task Tracker CLI

This project is a simple command-line interface (CLI) for managing tasks. The CLI allows users to add, update, delete, and list tasks, as well as mark them as "in-progress" or "done."

### Repository URL:
- [GitHub Repository](https://github.com/terminal-codes)

### Project URL:
- [Task Tracker on Roadmap](https://roadmap.sh/projects/task-tracker)

## Features
- Add new tasks
- Update task descriptions
- Delete tasks
- Mark tasks as "in-progress" or "done"
- List tasks with an optional filter for task status

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/terminal-codes.git
   ```
2. Navigate into the project directory:
   ```bash
   cd cli-task
   ```
3. Install the dependencies (if any):
   ```bash
   npm install
   ```

## Usage

You can run the CLI directly from your terminal.

### Available Commands

- **Add a new task:**
   ```bash
   node index.js add "Task description"
   ```
   Adds a new task with the provided description.

- **Update an existing task:**
   ```bash
   node index.js update <task_id> "New task description"
   ```
   Updates the task with the specified ID.

- **Delete a task:**
   ```bash
   node index.js delete <task_id>
   ```
   Deletes the task with the given ID.

- **Mark a task as "in-progress":**
   ```bash
   node index.js mark-in-progress <task_id>
   ```
   Marks the specified task as "in-progress."

- **Mark a task as "done":**
   ```bash
   node index.js mark-done <task_id>
   ```
   Marks the specified task as "done."

- **List tasks:**
   ```bash
   node index.js list
   ```
   Lists all tasks.

- **List tasks by status:**
   ```bash
   node index.js list <status>
   ```
   Lists tasks with a specific status (`todo`, `in-progress`, or `done`).

## Running the CLI Globally

To run the CLI from anywhere on your machine, you can configure it globally:

1. Open your `package.json` and add the following field:
   ```json
   "bin": {
     "task-tracker": "./index.js"
   }
   ```

2. Run the following command to link the CLI globally:
   ```bash
   npm link
   ```

Now you can run the CLI using the `task-tracker` command:

- Example:
   ```bash
   task-tracker add "New task description"
   ```

## Task Data Storage

Tasks are stored in a `tasks.json` file, which will be created in the same directory as the script if it does not exist. The tasks are saved as an array of objects, each containing an ID, description, status, and timestamps for when the task was created and last updated.

## License
This project is licensed under the MIT License.

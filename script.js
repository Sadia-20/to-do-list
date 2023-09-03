document.addEventListener("DOMContentLoaded", function () {
    const todoInput = document.getElementById("todoInput");
    const addBtn = document.getElementById("addBtn");
    const resetTasksBtn = document.getElementById("resetTasks");
    const completeAllBtn = document.getElementById("completeAll");
    const clearCompletedBtn = document.getElementById("clearCompleted");
    const searchInput = document.getElementById("searchInput");
    const taskList = document.getElementById("taskList");
    const taskCount = document.getElementById("taskCount");

    const allTasksRadio = document.getElementById("allTasks");
    const pendingTasksRadio = document.getElementById("pendingTasks");
    const completedTasksRadio = document.getElementById("completedTasks");

    let tasks = [];

    // Load tasks from localStorage
    if (localStorage.getItem("tasks")) {
        tasks = JSON.parse(localStorage.getItem("tasks"));
        renderTasks();
    }

    addBtn.addEventListener("click", function () {
        const todoText = todoInput.value.trim();
        if (todoText !== "") {
            tasks.push({ text: todoText, completed: false });
            saveTasksToLocalStorage();
            renderTasks();
            todoInput.value = "";
        } else {
            alert("Please add a task, it's empty.");
        }
    });

    resetTasksBtn.addEventListener("click", function () {
        if (tasks.length > 0) {
            const confirmReset = confirm("Are you sure you want to reset all tasks?");
            if (confirmReset) {
                tasks = [];
                saveTasksToLocalStorage();
                renderTasks();
            }
        } else {
            alert("There are no tasks to reset.");
        }
    });

    completeAllBtn.addEventListener("click", function () {
        if (tasks.length === 0) {
            alert("There are no tasks to complete.");
        } else {
            const allCompleted = tasks.every((task) => task.completed);
            if (!allCompleted) {
                tasks.forEach((task) => {
                    task.completed = true;
                });
                saveTasksToLocalStorage();
                renderTasks();
                alert("Congratulations, all your tasks are completed!");
            } else {
                alert("All tasks are already completed.");
            }
        }
    });

    clearCompletedBtn.addEventListener("click", function () {
        if (tasks.some((task) => task.completed)) {
            const confirmDelete = confirm("Are you sure you want to clear the completed tasks?");
            if (confirmDelete) {
                tasks = tasks.filter((task) => !task.completed);
                saveTasksToLocalStorage();
                renderTasks();
            }
        } else {
            alert("There are no completed tasks to delete.");
        }
    });

    searchInput.addEventListener("input", function () {
        renderTasks();
    });

    allTasksRadio.addEventListener("change", function () {
        renderTasks();
    });

    pendingTasksRadio.addEventListener("change", function () {
        renderTasks();
    });

    completedTasksRadio.addEventListener("change", function () {
        renderTasks();
    });

    function renderTasks() {
        const searchTerm = searchInput.value.toLowerCase();
        let filteredTasks = tasks.filter(
            (task) => task.text.toLowerCase().includes(searchTerm)
        );

        // Apply filter based on the selected radio button
        if (pendingTasksRadio.checked) {
            filteredTasks = filteredTasks.filter((task) => !task.completed);
        } else if (completedTasksRadio.checked) {
            filteredTasks = filteredTasks.filter((task) => task.completed);
        }

        taskList.innerHTML = "";

        filteredTasks.forEach((task, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <input type="checkbox" id="task-${index}" ${
                task.completed ? "checked" : ""
            }>
                <label for="task-${index}" class="task-text">${
                task.completed ? "<s>" + task.text + "</s>" : task.text
            }</label>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            `;

            const checkbox = listItem.querySelector(`#task-${index}`);
            const editButton = listItem.querySelector(".edit-btn");
            const deleteButton = listItem.querySelector(".delete-btn");

            checkbox.addEventListener("change", function () {
                task.completed = !task.completed;
                saveTasksToLocalStorage();
                renderTasks();
                if (task.completed) {
                    alert("Hurray! You did it!");
                } else {
                    alert("Task marked as incomplete.");
                }
            });

            editButton.addEventListener("click", function () {
                const label = listItem.querySelector(".task-text");
                const newText = prompt("Edit task:", task.text);
                if (newText !== null) {
                    task.text = newText;
                    saveTasksToLocalStorage();
                    renderTasks();
                }
            });

            deleteButton.addEventListener("click", function () {
                const confirmDelete = confirm("Are you sure you want to delete this task?");
                if (confirmDelete) {
                    tasks.splice(index, 1);
                    saveTasksToLocalStorage();
                    renderTasks();
                }
            });

            taskList.appendChild(listItem);
        });

        // Update the task count
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((task) => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;

        taskCount.textContent = `Total tasks: ${totalTasks} (Completed: ${completedTasks}, Pending: ${pendingTasks})`;
    }

    function saveTasksToLocalStorage() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Initial render
    renderTasks();
});

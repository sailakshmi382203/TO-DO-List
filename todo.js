// Variables to reference HTML elements
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const searchInput = document.getElementById('search-input');
const statusSelectInput = document.getElementById('status-select-input');
const statusSelect = document.getElementById('status-select');
const clearAllBtn = document.getElementById('clear-all-btn');

// Load tasks from localStorage
const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToDOM(task.text, task.status));
};

// Save tasks to localStorage
const saveTasks = () => {
    const tasks = [];
    document.querySelectorAll('li').forEach(taskElement => {
        const text = taskElement.querySelector('.task-text').textContent;
        const status = taskElement.querySelector('.task-status').textContent;
        tasks.push({ text, status });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Add task to DOM
const addTaskToDOM = (text, status) => {
    const li = document.createElement('li');
    li.innerHTML = `
        <span class="task-text">${text}</span>
        <span class="task-status">${status}</span>
        <button class="complete-btn">✔</button>
        <button class="delete-btn">✖</button>
    `;
    todoList.appendChild(li);

    // If status is "complete", apply strike-through style
    if (status === 'complete') {
        li.classList.add('completed');
    }

    // Mark as complete (Toggle strike-through)
    li.querySelector('.complete-btn').addEventListener('click', () => {
        // Toggle strike-through without modifying the status text
        li.classList.toggle('completed');
        saveTasks(); // Save tasks after toggling
    });

    // Delete task
    li.querySelector('.delete-btn').addEventListener('click', () => {
        li.remove();
        saveTasks();
    });
};

// Add task
const addTask = () => {
    const taskText = todoInput.value.trim();
    const taskStatus = statusSelectInput.value;
    if (!taskText) return;

    addTaskToDOM(taskText, taskStatus);
    todoInput.value = ''; // Clear input field
    saveTasks();
};

// Filter tasks by search input (name) and status
const searchTasks = () => {
    const searchText = searchInput.value.toLowerCase();
    const selectedStatus = statusSelect.value;

    document.querySelectorAll('li').forEach(task => {
        const taskText = task.querySelector('.task-text').textContent.toLowerCase();
        const taskStatus = task.querySelector('.task-status').textContent.toLowerCase();

        const matchesName = taskText.includes(searchText);
        const matchesStatus = selectedStatus === 'all' || taskStatus === selectedStatus;

        if (matchesName && matchesStatus) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });
};

// Clear all tasks
const clearAllTasks = () => {
    todoList.innerHTML = '';
    localStorage.removeItem('tasks');
};

// Event listeners
addBtn.addEventListener('click', addTask);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
searchInput.addEventListener('input', searchTasks);
statusSelect.addEventListener('change', searchTasks);
clearAllBtn.addEventListener('click', clearAllTasks);

// Load tasks when the page loads
window.onload = loadTasks;

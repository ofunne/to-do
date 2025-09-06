const taskInput = document.querySelector('.task-input')
const addButton = document.querySelector('.add-button')
const taskList = document.querySelector('.task-list')
const emptyBlock = document.querySelector('.empty')
const clearButton = document.querySelector('.clear-button')

let tasks = []

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function loadTasks() {
    const storedTasks = localStorage.getItem('tasks')
    if (storedTasks) {
        tasks = JSON.parse(storedTasks)
        tasks.forEach(task => {
            const taskElement = createTaskElement(task)
            taskList.appendChild(taskElement)
        })
    }
    updateEmptyState()
}

function createTaskElement(task) {
    const taskItem = document.createElement('li')
    taskItem.className = 'task-item'
    taskItem.dataset.id = task.id

    taskItem.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
        <span class="task-text">${task.text}</span>
        <button type="button" class="task-delete-button"></button>
    `

    return taskItem
}

function updateEmptyState() {
    const hasTasks = tasks.length > 0

    emptyBlock.style.display = hasTasks ? 'none' : 'flex'
    taskList.style.display = hasTasks ? 'flex' : 'none'
}

function addTask() {
    const text = taskInput.value.trim()

    if (text === '') return

    const newTask = {
        id: Date.now().toString(),
        text: text,
        completed: false
    }

    tasks.unshift(newTask)

    const taskElement = createTaskElement(newTask)
    taskList.prepend(taskElement)

    taskInput.value = ''
    saveTasks()
    updateEmptyState()
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId)

    const taskElement = taskList.querySelector(`[data-id="${taskId}"]`)
    if (taskElement) taskElement.remove()

    saveTasks()
    updateEmptyState()
}

function clearTasks() {
    tasks = []
    taskList.innerHTML = ''
    saveTasks()
    updateEmptyState()
}

addButton.addEventListener('click', addTask)

clearButton.addEventListener('click', clearTasks)

taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask()
    }
})

taskList.addEventListener('click', function (e) {
    const taskItem = e.target.closest('.task-item')
    if (!taskItem) return

    const taskId = taskItem.dataset.id

    if (e.target.classList.contains('task-delete-button')) {
        deleteTask(taskId)
    }

    if (e.target.classList.contains('task-checkbox')) {
        const task = tasks.find(t => t.id === taskId)
        if (task) {
            task.completed = e.target.checked
            saveTasks()
        }
    }
})

document.addEventListener('DOMContentLoaded', loadTasks)

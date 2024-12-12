document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks(filterType = 'all') {
        taskList.innerHTML = '';
        
        const filteredTasks = tasks.filter(task => {
            if (filterType === 'active') return !task.completed;
            if (filterType === 'completed') return task.completed;
            return true;
        });

        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
                <span>${task.text}</span>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            `;

            const checkbox = li.querySelector('.checkbox');
            checkbox.addEventListener('change', () => toggleTask(index));

            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => deleteTask(index));

            taskList.appendChild(li);
        });
    }

    function addTask(text) {
        if (text.trim() !== '') {
            tasks.push({ text, completed: false });
            saveTasks();
            renderTasks();
            taskInput.value = '';
            
            // Add animation effect
            const newTask = taskList.lastElementChild;
            newTask.style.animation = 'slideIn 0.3s ease forwards';
        }
    }

    function toggleTask(index) {
        const taskElement = taskList.children[index];
        tasks[index].completed = !tasks[index].completed;
        
        if (tasks[index].completed) {
            taskElement.classList.add('completed');
        }
        
        saveTasks();
        setTimeout(() => {
            renderTasks();
        }, 300);
    }

    function deleteTask(index) {
        const taskElement = taskList.children[index];
        taskElement.classList.add('deleting');
        
        setTimeout(() => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        }, 300);
    }

    addTaskBtn.addEventListener('click', () => addTask(taskInput.value));
    
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(taskInput.value);
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTasks(btn.dataset.filter);
        });
    });

    // Add theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', () => {
        themeToggle.style.animation = 'none';
        setTimeout(() => {
            themeToggle.style.animation = 'rotateIcon 0.3s ease';
        }, 10);
    });

    // Initial render
    renderTasks();
});

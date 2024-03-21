const form = document.querySelector('#form');
const taskInput = document.querySelector('#task_input');
const tasksList = document.querySelector('#tasks_list');
const emptyList = document.querySelector('#empty_list');
const emptyListDIV = document.querySelector('#empty_list div');

let tasks = [];


// Рендерим содержимое localStorage на страницу, если оно есть
if(localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));

    tasks.forEach((task) => {
        const cssClass = task.done ? "task_title task-title--done" : "task_title";
    
        // Формируем разметку для новой задачи
        const taskHTML = 
        `
            <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                <span class="${cssClass}">${task.text}</span>
    
                <div class="task-item__buttons">
                    <button type="button" data-action="done" class="btn-action">
                        <img src="./img/tick.svg" alt="Done" width="18" height="18">
                    </button>
    
                    <button type="button" data-action="delete" class="btn-action">
                        <img src="./img/cross.svg" alt="Delete" width="18" height="18">
                    </button>
                </div>
            </li>
        `;
    
        // Добавляем задачу на страницу
        tasksList.insertAdjacentHTML('beforeend', taskHTML);
    
        // Функция проверки на существование списка дел и отображение теста на экране
        displayingTheToDoListCheck();
    })
};


// --------------------------- Функции START----------------------------
// Проверка на существование списка дел и отображение теста на экране
function displayingTheToDoListCheck() {
    if(tasksList.children.length > 1) {
        emptyListDIV.innerHTML = 'Есть дела!'
    } else {
        emptyListDIV.innerHTML = 'Список дел пуст'
    }
};

// Функция добавления задачи
function addTask(event) {
    // Отменяем отправку формы
    event.preventDefault();

    // Текст из поля ввода формы
    const taskInputText = taskInput.value;

    // Описываем задачу в виде объекта
    const newTask = {
        id: Date.now(),
        text: taskInputText,
        done: false
    };

    // Добавляем задачу в массив с задачами
    tasks.push(newTask);

    // Формируем CSS класс в котором будет разное содержание в
    // зависимости от принимаемого булевого значения в newTask.done.
    // Если значение будет true, то задача становится перчеркнутой и выполненной,
    // Если значение будет false, то задача еще не выполнена и не перечеркнута
    const cssClass = newTask.done ? "task_title task-title--done" : "task_title";

    // Формируем разметку для новой задачи
    const taskHTML = 
    `
        <li id="${newTask.id}" class="list-group-item d-flex justify-content-between task-item">
            <span class="${cssClass}">${newTask.text}</span>

            <div class="task-item__buttons">
                <button type="button" data-action="done" class="btn-action">
                    <img src="./img/tick.svg" alt="Done" width="18" height="18">
                </button>

                <button type="button" data-action="delete" class="btn-action">
                    <img src="./img/cross.svg" alt="Delete" width="18" height="18">
                </button>
            </div>
        </li>
    `;

    // Добавляем задачу на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML);

    // Очищаем поле ввода и возвращаем на него фокус
    taskInput.value = '';
    taskInput.focus();

    // Функция проверки на существование списка дел и отображение теста на экране
    displayingTheToDoListCheck();

    saveToLocalStorage()
};

// Функция удаления задачи
function deleteTask(event) {
    // Проверяем, что клик был НЕ по кнопке удалить(delete)
    if(event.target.dataset.action !== 'delete') return

    const parentNode = event.target.closest('.list-group-item');

    // Определяем ID задачи
    const id = Number(parentNode.id)

    // =================== 1. Способ нахождения индекса массива и удаление по индексу через findIndex() ===================

    // Находим индекс задачи в массиве. findIndex вернет номер(индекс) массива, если в условии ниже будет true
    const indexOfTasksByID = tasks.findIndex(function(task) {
        if (task.id === id) {
            return true
        }
        // Можно сократить до такой записи:
        // return task.id === id
        // И тогда если будет совпадение по ID функция вернет true,
        // а если не будет совпадений - вернет false
    });



    // Удаления задачу из масиива с задачами tasks
    tasks.splice(indexOfTasksByID, 1); // В первом аргументе у метода splice() указываем
                                       // индекс с которого нужно начать вырезать элементы в массиве.
                                       // Во втором аргументе мы указываем количество элементов,
                                       // которое мы хотим вырезать.
    // ====================================================================================================================



    // ======== 2. Способ нахождения индекса массива через filter() и отфильтровывание массива с искомым индексом =========

    // tasks = tasks.filter((task) => task.id !== id); // Если ID не совпадает с удаляемым ID, то вернет true и перезапишет
                                                       // в новый массив, если совпадает - вернет false и отфильтрует.
    // ====================================================================================================================
    

    // Удаления задачу из разметки
    parentNode.remove()

    displayingTheToDoListCheck();
    
    saveToLocalStorage()
};

// Функция для обозначения выполненной задачи
function doneTask(event) {
    // Проверяем, что клик был НЕ по кнопке выполнено(done)
    if(event.target.dataset.action !== 'done') return

    const parentNode = event.target.closest('.list-group-item');

    const id = Number(parentNode.id);

    const task = tasks.find((task) => task.id === id);

    task.done = !task.done

    const taskTitle = parentNode.querySelector('.task_title');
    taskTitle.classList.toggle('task-title--done')
    
    saveToLocalStorage()
};

// Функция сохранения массива tasks в localStorage
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};
// ---------------------------- Функции END -----------------------------

displayingTheToDoListCheck();

// Добавление задачи
form.addEventListener('submit', addTask);

// Удаление задачи
tasksList.addEventListener('click', deleteTask);

// Отмечаем, что задача выполнена
tasksList.addEventListener('click', doneTask);



// console.log(emptyListDIV)
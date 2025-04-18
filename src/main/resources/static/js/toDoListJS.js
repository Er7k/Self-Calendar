
document.getElementById('addTaskButton').addEventListener('click', function() {
    console.log('Button clicked');
    const toDoList = document.getElementById('toDoItems');
    const taskText = prompt("Enter new task: ");

    if (taskText && taskText.trim() !== "") {
        const addTask = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        addTask.appendChild(checkbox);
        addTask.appendChild(document.createTextNode(' ' + taskText));

        toDoList.appendChild(addTask);
    } else {
        alert("Task cannot be empty!");
    }

});

document.getElementById('addTask').addEventListener('click', function() {
    const inputBox = document.getElementById('inputBox');
    const taskText = inputBox.value.trim();

    if (taskText !== "") {
        const listContainer = document.getElementById("listContainer");
        const addTask = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('checkbox-icon');

        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {
                addTask.style.textDecoration = 'line-through';
            } else {
                addTask.style.textDecoration = 'none';
            }
        });

        addTask.appendChild(checkbox);
        addTask.appendChild(document.createTextNode(' ' + taskText));


        const deleteIcon = document.createElement('span');
        deleteIcon.innerHTML = '✖';
        deleteIcon.classList.add('delete-icon');
        addTask.appendChild(deleteIcon);

        listContainer.appendChild(addTask);

        inputBox.value = "";

        saveData();
    } else {
        alert("Task cannot be empty");
    }

});


 document.getElementById('listContainer').addEventListener("click", function(e) {
    if(e.target.tagName === "LI"){
    e.target.classList.toggle("checked");
    saveData();
  }
    else if (e.target.classList.contains("delete-icon")) {
    e.target.parentElement.remove();
    saveData();
 }
 }, false);

 function saveData(){
     const listContainer = document.getElementById("listContainer");
     localStorage.setItem("data", listContainer.innerHTML);
   }
   function showTask(){
     const listContainer = document.getElementById("listContainer");
     listContainer.innerHTML = localStorage.getItem("data") || "";
   }
   showTask();

const taskInput = document.querySelector("#taskInput");
const addBtn = document.querySelector("#addBtn");
const filterSelect = document.querySelector("#filterSelect");
const sortingSelect = document.querySelector("#sortingSelect");
const tasksDiv = document.querySelector("#tasksDiv");
const clearBtn = document.querySelector("#clearBtn");

let elements = [];

let savedElements = localStorage.getItem("tasks");

if (savedElements) {
  elements = JSON.parse(savedElements);
}

function displayItems() {
  tasksDiv.innerHTML = "";
  filterSelect.value = "All";

  let active = [];
  let completed = [];

  function sort() {
    sortingSelect.addEventListener("change", function () {
      elements.sort(function (a, b) {
        if (a.createdAt.valueOf() > b.createdAt.valueOf()) return 1;
        if (a.createdAt.valueOf() < b.createdAt.valueOf()) return -1;
        return 0;
      });
      if (sortingSelect.value === "Newest to Oldest") elements.reverse();
      displayItems();
    });
  }

  sort();

  for (let i = 0; i < elements.length; i++) {
    const taskDiv = document.createElement("div");
    const taskLeft = document.createElement("div");
    const taskRight = document.createElement("div");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute("class", "checkbox");
    const taskText = document.createElement("p");
    taskText.textContent = elements[i].text;

    taskLeft.appendChild(checkbox);
    taskLeft.appendChild(taskText);

    const editBtn = document.createElement("button");
    const editImg = document.createElement("img");
    editImg.src = "https://pngfre.com/wp-content/uploads/Pencil-37.png";
    editBtn.appendChild(editImg);

    const deleteBtn = document.createElement("button");
    const deleteImg = document.createElement("img");
    deleteImg.src =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Red_X.svg/2048px-Red_X.svg.png";
    deleteBtn.appendChild(deleteImg);

    taskRight.appendChild(editBtn);
    taskRight.appendChild(deleteBtn);

    taskDiv.appendChild(taskLeft);
    taskDiv.appendChild(taskRight);

    taskLeft.classList.add("subtask");
    taskRight.classList.add("subtask");
    taskDiv.classList.add("taskDiv");

    tasksDiv.appendChild(taskDiv);
    checkbox.checked = elements[i].checkedStatus;

    active.push(taskDiv);

    if (checkbox.checked) {
      completed.push(taskDiv);
      active = active.filter((task) => task !== taskDiv);
    } else {
      completed = completed.filter((task) => task !== taskDiv);
    }

    checkbox.addEventListener("change", function () {
      if (this.checked) {
        elements[i].checkedStatus = true;
        localStorage.setItem("tasks", JSON.stringify(elements));
        completed.push(taskDiv);
        active = active.filter((task) => task !== taskDiv);
        if (filterSelect.value === "Active") {
          taskDiv.classList.add("hidden");
        }
        countUpdate();
      } else {
        elements[i].checkedStatus = false;
        localStorage.setItem("tasks", JSON.stringify(elements));
        active.push(taskDiv);
        completed = completed.filter((task) => task !== taskDiv);
        if (filterSelect.value === "Completed") {
          taskDiv.classList.add("hidden");
        }
        countUpdate();
      }
    });

    deleteBtn.addEventListener("click", function () {
      tasksDiv.removeChild(taskDiv);
      elements.splice(i, 1);
      localStorage.setItem("tasks", JSON.stringify(elements));
      displayItems();
    });

    editBtn.addEventListener("click", function () {
      const changeInput = document.createElement("input");
      changeInput.value = elements[i].text;
      const changeSubmitBtn = document.createElement("input");
      changeSubmitBtn.type = "submit";
      taskDiv.appendChild(changeInput);
      taskDiv.appendChild(changeSubmitBtn);
      taskDiv.style.position = "relative";
      changeInput.style.position = "absolute";
      changeInput.style.left = "10vw";
      changeSubmitBtn.style.position = "absolute";
      changeSubmitBtn.style.left = "20vw";
      editBtn.disabled = true;

      changeSubmitBtn.addEventListener("click", function () {
        elements[i].text = changeInput.value;
        taskText.textContent = elements[i].text;
        taskDiv.removeChild(changeInput);
        taskDiv.removeChild(changeSubmitBtn);
        editBtn.disabled = false;
        localStorage.setItem("tasks", JSON.stringify(elements));
      });
    });
  }

  function filter() {
    filterSelect.addEventListener("change", function () {
      if (filterSelect.value === "Active") {
        active.forEach((task) => task.classList.remove("hidden"));
        completed.forEach((task) => task.classList.add("hidden"));
        sort();
      } else if (filterSelect.value === "Completed") {
        active.forEach((task) => task.classList.add("hidden"));
        completed.forEach((task) => task.classList.remove("hidden"));
        sort();
      } else {
        active.forEach((task) => task.classList.remove("hidden"));
        completed.forEach((task) => task.classList.remove("hidden"));
      }
    });
  }
  filter();

  clearBtn.addEventListener("click", function () {
    elements = elements.filter((element) => element.checkedStatus === false);
    localStorage.setItem("tasks", JSON.stringify(elements));
    displayItems();
    countUpdate();
  });

  const taskNum = document.createElement("p");
  tasksDiv.appendChild(taskNum);

  function countUpdate() {
    taskNum.textContent = `Active Tasks: ${active.length}, Completed Tasks: ${completed.length}`;
  }
  countUpdate();
}

function addNewTask() {
  if (taskInput.value !== "") {
    const newTodo = {
      text: taskInput.value,
      checkedStatus: false,
      createdAt: null,
    };
    newTodo.createdAt = new Date();
    elements.push(newTodo);
    localStorage.setItem("tasks", JSON.stringify(elements));
    taskInput.value = "";
  }
}

addBtn.addEventListener("click", function () {
  addNewTask();
  displayItems();
});

displayItems();

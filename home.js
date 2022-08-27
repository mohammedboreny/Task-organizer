// function to set a given theme/color-scheme
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}

// function to toggle between light and dark theme
function toggleTheme() {
    if (localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-light');
    } else {
        setTheme('theme-dark');
    }
}

// Immediately invoked function to set the theme on initial load
(function () {
    if (localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-dark');
        document.getElementById('slider').checked = false;
    } else {
        setTheme('theme-light');
        document.getElementById('slider').checked = true;
    }
})();

//End of set theme

// Get Element from HTML
let formTask = document.getElementById("newTask");
let cards=document.getElementById("cardsTask");
let outBtn=document.getElementById("signOutBtn");
let delBtn=document.getElementById("delBtn");
let filterSelect=document.getElementById("filter");
let clearButton=document.getElementById("clearBtn");
let welcomeName=document.getElementById("welcomeName");

//Edit Welcome Message
welcomeName.innerHTML= `${users[curIndex].fname} ${users[curIndex].lname}`;

// To show old tasks for user in saved tasks section
function loadOldTasks(arr) {
    // To loop Tasks Array for the current user
    arr.forEach((e,i) => {
        // To Create new Div for task and append it in HTML Page
        let cardTask=document.createElement("div");
        if(!e.isCompleted) {
        cardTask.innerHTML= `
            <h3 style="background-color: ${e.colors};">${e.title}</h3>
            <div class="taskBody" style="box-shadow: 0px 0px 5px 5px ${e.colors}, 0px 0px 40px 5px ${e.colors};">
                <p>${e.desc}</p>
                <div class="doneRemoveDiv">
                    <button class="removeTaskBtn"><i id="deleteBtn" class="fa-regular fa-trash-can fa-2xl"></i></button>
                    <button class="doneTaskBtn"><i id="complete${i}" class="fa-regular fa-circle-check fa-2xl"></i></button>
                </div>
        </div>
        <div class="priorityImgParent ${e.priority}Priority">
            <img src="./img/${e.priority}-priority.png">
        </div>
    `
        }
        else {
            cardTask.innerHTML= `
            <h3 style="background-color: gray;">${e.title}</h3>
            <div class="taskBody" style="border: 1px solid gray">
                <p>${e.desc}</p>
                <div class="doneRemoveDiv">
                    <button class="removeTaskBtn"><i id="deleteBtn" class="fa-regular fa-trash-can fa-2xl"></i></button>
                    <button class="doneTaskBtn" style="color:green"><i id="complete${i}" class="fa-regular fa-circle-check fa-2xl"></i></button>
                </div>
        </div>
        <div class="priorityImgParent" style= "border-bottom: 50px solid gray">
            <img src="./img/${e.priority}-priority.png">
        </div>
        `;
        cardTask.style.opacity="0.75";
        }
    cardTask.classList=`taskCard col-md-4`;
    cards.append(cardTask);
    });
}

//Ensure user already have old tasks
window.onload = () => {
    if(users[curIndex].tasks.length==0) {
        cards.innerHTML =`<h2> You Don't Have Any Task Today !</h2>`;
    }
    else {
        cards.innerHTML='';
    }
    loadOldTasks(users[curIndex].tasks);
}

//Constructer to save task in new object
function Task(title,desc,priority) {
    this.title=title;
    this.desc=desc;
    this.priority=priority;
    this.isCompleted = false; 
    this.color = function () {
        switch(this.priority) {
            case "Critical":
                return "#fd4848";
                break;
            case "Normal":
                return "#FFBA4A";
                break;
            case "Low":
                return "#00c9af";
                break;
        }
    }
    // To save Priority color in variable
    this.colors= this.color();
}

// Call function addTask when submitted form 
formTask.addEventListener("submit" , addTask);

// To add new Task in section saved Tasks
function addTask(e) {
    e.preventDefault();
    // To save info task and create object of task
    let title= document.getElementById("title").value;
    let desc= document.getElementById("desc").value;
    let prio= document.querySelector('input[name="priority"]:checked').value;
    let task=new Task(title,desc,prio);

    // To Create new Div for task and append it in HTML Page
    let cardTask=document.createElement("div");
    cardTask.innerHTML= `
        <h3 style="background-color: ${task.color()};">${title}</h3>
        <div class="taskBody" style="box-shadow: 0px 0px 5px 5px ${task.color()}, 0px 0px 40px 5px ${task.color()};">
            <p>${desc}</p>
            <div class="doneRemoveDiv">
                <button class="removeTaskBtn><i id="delBtn" class="fa-regular fa-trash-can fa-2xl"></i></button>
                <button class="doneTaskBtn"><i id="complete${users[curIndex].tasks.length-1}" class="fa-regular fa-circle-check fa-2xl"></i></button>
            </div>
        </div>
        <div class="priorityImgParent ${prio}Priority">
            <img src="./img/${prio}-priority.png">
        </div>
        `
    cardTask.classList=`taskCard col-md-4`;
    cards.append(cardTask);

    //To Clear a form
    formTask.reset();

    //To Save new Task in Local Storage
    users[curIndex].tasks.push(task);
    localStorage.setItem("users" , JSON.stringify(users));
    location.reload();
}

//To move to index page and logout from website
outBtn.onclick = () => {
    localStorage.removeItem("curIndex");
    location.replace("./index.html");
}

//To delete card task
document.addEventListener("click" , (e) => {
    //check click button is equal delete button
    if(e.target.id=="deleteBtn") {
        // alert to confirm delete proccess
        swal({
            title: "Are you sure?",
            text: "You Will Delete The Task",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            // if user press OK proccess will completed 
            if (willDelete) {
              swal("Done , Deleted the Task", {
                icon: "success",
              });
              //To Remove task from HTML page and remove it from local storage
              e.path[4].remove();
              let indexOfTask= Array.prototype.indexOf.call(cards.children, e.path[4]);
              users[curIndex].tasks.splice(indexOfTask,1);
              localStorage.setItem("users",JSON.stringify(users));
            }
          });
    }
})

//to change tho show tasks in saved tasks section depand on priority
filterSelect.onchange = (e) => {
    let prio=e.target.value;
    //if user choose all will show all tasks
    if(prio=="All") {
        users[curIndex].tasks.forEach((e ,i) => { 
            cards.children[i].style.display="block";
        })
    }
    else {
        // To loop in array tasks for current user
        users[curIndex].tasks.forEach((e ,i) => {
            if(e.priority == prio) {
                cards.children[i].style.display="block";
            }
            else {
                cards.children[i].style.display="none";
            }
        })
    }
}

//To clear completed tasks
clearButton.onclick= (e) => {
    //index to loop over cards
    swal({
        title: "Are you sure?",
        text: "You will delete all completed tasks",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            let i=0;
            for (let i=0;i<cards.children.length;i++) {
            if(users[curIndex].tasks[i].isCompleted) {
            //To Remove completed task card from HTML Page and local storage
                cards.children[i].remove();
                users[curIndex].tasks.splice(i,1);
                localStorage.setItem("users",JSON.stringify(users));
                i--;
        }
        }
          location.reload();
        }
      });
}

document.addEventListener("click" , (e) => {
    if(e.target.classList == "fa-regular fa-circle-check fa-2xl") {
        let index= e.target.id.slice(8);
        let isCom= users[curIndex].tasks[index].isCompleted;
        users[curIndex].tasks[index].isCompleted = !isCom;
        isCom = !isCom;
        localStorage.setItem("users" , JSON.stringify(users));
        let Color= users[curIndex].tasks[index].colors;
        if(isCom) {
            console.log(isCom);
            cards.children[index].style.opacity= "0.75";
            e.target.style.color = "green";
            e.path[3].style.cssText = `box-shadow : none ; border : 1px solid gray`
            e.path[4].children[0].style.cssText = `background-color: gray`;
            e.path[4].children[2].style.cssText = `border-bottom: 50px solid gray;`;
        }
        else {
            cards.children[index].style.opacity= "1";
            e.target.style.color = "gray";
            e.path[3].style.cssText = `box-shadow: 0px 0px 5px 5px ${Color}, 0px 0px 40px 5px ${Color}`;
            e.path[4].children[0].style.cssText = `background-color: ${Color}`;
            e.path[4].children[2].style.cssText = `border-bottom: 50px solid ${Color}`;
        }
    }
});


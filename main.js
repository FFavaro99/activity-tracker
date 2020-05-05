'use strict mode';

//Global constants and variables

let activityQueue = [];


let beginCountdown;
let beginPause;


let pauseHours = 0;
let pauseMinutes = 0;
let pauseSeconds = 0;

let paused = true;



//Utility functions

function zeroPad(x){
    if (x < 10){
        let y = `0${x}`;
        return y;
    }
    return x;
}




//Validation functions

function validTask(currentName, currentHours, currentMinutes){
    if (validName(currentName)){
        if (validTime(currentHours, currentMinutes)){
            return true;
        }
        else {
            alert('Invalid target time: cannot be 0');
        }
    }
    else {
        alert('Invalid task name: cannot be empty');
    }
    return false;
}

function validName(currentName){
    if (currentName.match(/^\s*$/))
        return false;
    return true;
}

function validTime(currentHours, currentMinutes){
    if (currentHours == 0 && currentMinutes == 0)
        return false;
    return true;
}



//Refreshing displayed info functions

function refreshAll(){
    refreshCurrentActivity();
    refreshCountdown();
    refreshNextActivity();
    refreshActivityList();
}

function refreshCurrentActivity(){
    const currentActivity = document.querySelector('.current-activity');
    if (activityQueue.length > 0){
        currentActivity.innerText = activityQueue[0].name;
    }
    else {
        currentActivity.innerText = 'No current activity';
    }
}

function refreshNextActivity(){
    const nextActivity = document.querySelector('.next-activity');
    if (activityQueue.length > 1){
        nextActivity.innerText = activityQueue[1].name;
    }
    else nextActivity.innerText = 'None';
}

function refreshCountdown(){
    let time;
    if (activityQueue.length > 0){
        const hours = zeroPad(activityQueue[0].hours);
        const minutes = zeroPad(activityQueue[0].minutes);
        const seconds = zeroPad(activityQueue[0].seconds);
        time = `${hours}:${minutes}:${seconds}`;
    }
    else {
        time = '00:00:00'
    }
    document.querySelector('.countdown').innerText = time;
}

function refreshActivityList(){
    const lis = document.querySelector('.todo-list').children;
    for (let i = 0; i < 10; i++){
        if (i < activityQueue.length){
            lis[i].children[0].innerText = activityQueue[i].name;
        }
        else {
            lis[i].children[0].innerText = 'No activity scheduled yet';
        }
    }
    if (activityQueue.length != 0){
        lis[0].children[0].classList.add('current');
        lis[0].classList.add('current');
    }
    else {
        lis[0].children[0].className = '';
        lis[0].className = '';
    }
}

function refreshPause(){
    if (paused){
        document.querySelector('.resume').innerText = 'Resume';
        document.querySelector('.pause').classList.add('counting');
        document.querySelector('.pause').innerText = `${zeroPad(pauseHours)}:${zeroPad(pauseMinutes)}:${zeroPad(pauseSeconds)}`;
    }
    else {
        document.querySelector('.start').innerText = 'Start';
        document.querySelector('.pause').classList.remove('counting');
        document.querySelector('.pause').innerText = 'Pause';
    }
}



//Congratulate (Happens at the end of an activity)

function congratulate() {
    document.querySelector('.congrats').hidden = false;
    setTimeout(function() {
        document.querySelector('.congrats').hidden = true;
    }, 3000);
}



//Queue manipulation functions
function addActivity(e){
    const name = document.querySelector('.activity-name');
    const hours = document.querySelector('.select-hours');
    const mins = document.querySelector('.select-minutes');
    const currentName = name.value;
    const currentHours = hours.children[hours.selectedIndex].value;
    const currentMinutes  = mins.children[mins.selectedIndex].value;

    //If valid input add the activity to the queue
    if (validTask(currentName, currentHours, currentMinutes)){
        const newActivity = {name: currentName, hours: currentHours, minutes: currentMinutes, seconds: 0};
        activityQueue.push(newActivity);
        alert('Task successfully added!');
        console.table(activityQueue); //Debugging purposes

    //diplaying info on screen
        refreshAll();
    }
}


function removeActivity(e){
    const index = this.getAttribute('data-index');

    if (index < activityQueue.length){
        let arr1 = [];
        let arr2 = [];
        for (let i = 0; i < activityQueue.length; i++){
            if (i < index){
                arr1.push(activityQueue[i]);
            }
            else if (i > index){
                arr2.push(activityQueue[i]);
            }
        }
        activityQueue = arr1.concat(arr2);
    }
    refreshAll();
}




//Counting functions

function startCountdown() {
    if (paused){
        clearInterval(beginPause);
        beginCountdown = setInterval(countdown, 1000);
        paused = false;
    } 
}

function countdown(){
    refreshPause();
    //If the timer is > 0
    if (activityQueue[0].hours > 0 || activityQueue[0].minutes > 0 || activityQueue[0].seconds > 0){
        if ( activityQueue[0].minutes == 0 && activityQueue[0].seconds == 0){
            activityQueue[0].hours--;
            activityQueue[0].minutes = 59;
            activityQueue[0].seconds = 59;
        }
        else if (activityQueue[0].seconds == 0){
            activityQueue[0].minutes--;
            activityQueue[0].seconds = 59;
        }
        else {
            activityQueue[0].seconds--;
        }
        refreshCountdown();
    }
    
    //If the timer gets to 0, aka the activity is finished
    else {
        congratulate();
        activityQueue.shift();
        pauseCountdown();
        refreshAll();
    }
}




function pauseCountdown() {
    if (!paused){
        paused = true;
        clearInterval(beginCountdown);
        pauseHours = 0;
        pauseMinutes = 0;
        pauseSeconds = 0;
        beginPause = setInterval(pauseCount, 1000);
    }
}

function pauseCount() {
    if (pauseSeconds == 59 && pauseMinutes == 59){
        pauseSeconds = 0;
        pauseMinutes = 0;
        pauseHours++;
    }
    else if (pauseSeconds == 59){
        pauseSeconds = 0;
        pauseMinutes++;
    }
    else {
        pauseSeconds++;
    }
    refreshPause();
}




//Event listeners

document.querySelector('.add-btn').addEventListener('click',addActivity);
document.querySelector('.start').addEventListener('click', startCountdown);
document.querySelector('.pause').addEventListener('click', pauseCountdown);

for (let element of Array.from(document.querySelectorAll('.remove'))){
    element.addEventListener('click', removeActivity);
}
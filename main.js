/*contains activities, which are objects with name, hours, minutes and seconds attribute*/
const activityQueue = [];
let paused;




//for the pause counting, until I find a better solution
let pauseHours = 0;
let pauseMinutes = 0;
let pauseSeconds = 0;

function zeroPad(x){
    if (x < 10){
        let y = `0${x}`;
        return y;
    }
    return x;
}

function validName(currentName){
    if (currentName != '')
        return true;
    return false;
}

function validTime(currentHours, currentMinutes){
    if (currentHours == 0 && currentMinutes == 0)
        return false;
    return true;
}

function refreshCurrentActivity(){
    const currentActivity = document.querySelector('.current-activity');
    currentActivity.innerText = activityQueue[0].name;
}

function refreshNextActivity(){
    const nextActivity = document.querySelector('.next-activity');
    nextActivity.innerText = activityQueue[1].name;
}

function refreshCountdown(){
    const hours = zeroPad(activityQueue[0].hours);
    const minutes = zeroPad(activityQueue[0].minutes);
    const seconds = zeroPad(activityQueue[0].seconds);
    const time = `${hours}:${minutes}:${seconds}`;
    document.querySelector('.countdown').innerText = time;
}

function addActivity(e){
    const name = document.querySelector('.activity-name');
    const hours = document.querySelector('.select-hours');
    const mins = document.querySelector('.select-minutes');
    const currentName = name.value;
    const currentHours = hours.children[hours.selectedIndex].value;
    const currentMinutes  = mins.children[mins.selectedIndex].value;
    if (validName(currentName)){
        if (validTime(currentHours, currentMinutes)){
            const newActivity = {name: currentName, hours: currentHours, minutes: currentMinutes, seconds: 0};
            activityQueue.push(newActivity);
            alert('Task successfully added!');
            console.table(activityQueue);
            if (activityQueue.length == 1){
                refreshCurrentActivity();
                refreshCountdown();
            }
            else if (activityQueue.length == 2){
                refreshNextActivity();
            }
        }
        else
            alert('Invalid task duration!');
    }
    else
        alert('Invalid task name!');
}

function congratulate() {
    document.querySelector('.congrats').hidden = false;
    setTimeout(function() {
        document.querySelector('.congrats').hidden = true;
    }, 3000);
}

function startCountdown(){
    if (activityQueue.length >= 1){
        if (paused == undefined){
            paused = false;
            setInterval(function() {
                if ( (activityQueue[0].hours > 0 || activityQueue[0].minutes > 0 || activityQueue[0].seconds > 0) && !paused){
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
            else if (activityQueue[0].hours == 0 && activityQueue[0].minutes == 0 && activityQueue[0].seconds == 0){
                congratulate();
                activityQueue.shift();
                if (activityQueue.length > 1){
                    refreshCurrentActivity();
                    refreshCountdown();
                    refreshNextActivity();
                }
                else if (activityQueue.length == 1){
                    refreshCurrentActivity();
                    refreshCountdown();
                    document.querySelector('.next-activity').innerText = 'None';
                }
                pauseCountdown();
            }
        }, 1000);
        }
        else {
            paused = false;
        }
    }
}


function pauseCountdown(){
    if (paused == undefined){}
    else{
        paused = true;
        pauseHours = 0;
        pauseMinutes = 0;
        pauseSeconds = 0;
    }
}





/*                            THINGS MISSING:

    - congratulate function to praise user for finishing a task

*/





document.querySelector('.add-btn').addEventListener('click',addActivity);
document.querySelector('.start').addEventListener('click', startCountdown);
document.querySelector('.pause').addEventListener('click', pauseCountdown);



//Counting the pause

setInterval(function() {
    
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

    if (paused && activityQueue.length != 0) {
        document.querySelector('.pause').classList.add('counting');
        document.querySelector('.pause').innerText = `${zeroPad(pauseHours)}:${zeroPad(pauseMinutes)}:${zeroPad(pauseSeconds)}`;
    }
    else {
        document.querySelector('.pause').classList.remove('counting');
        document.querySelector('.pause').innerText = 'Pause';
    }
    
}, 1000);
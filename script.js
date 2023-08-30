// Load tasks from localStorage when the page loads
window.addEventListener('load', () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('taskList');

    savedTasks.forEach(task => {
        addTaskWithTimer(task.text, task.duration);
    });
});

function saveTasksToLocalStorage() {
    const taskElements = document.querySelectorAll('.task');
    const tasks = Array.from(taskElements).map(taskElement => {
        const text = taskElement.innerText;
        const duration = taskElement.getAttribute('data-duration');
        return { text, duration };
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
} 

let timerIntervalId = null;
let isTimerPaused = false;
let pausedSecondsRemaining = null;
let secondsRemaining = null;

document.getElementById('formId').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
}); 

function addTaskOnEnter(event) {
    if (event.key === "Enter") {       
        const taskText = document.getElementById('taskInput').value.trim();
        const timerInput = document.getElementById('timerInput').value.trim();
        addTaskWithTimer(taskText, timerInput);
    }
}

function addTaskWithTimer(taskText, timerInput) {
    // Validation: Check if both fields are filled
    if (timerInput === "" || isNaN(parseFloat(timerInput)) || taskText === "") {
        alert("Please enter a valid todo name.");
        return;
    }

    if (taskText !== '' && timerInput !== '') {
        const taskList = document.getElementById('taskList')
        const li = document.createElement('li')
        const durationInHours = parseFloat(timerInput)

        const timerValue = parseFloat(timerInput)

        const formattedTime = formatTime(timerValue)

        li.innerHTML = `
            <span class="task" data-duration="${durationInHours}" onclick="completeTask(this)">${taskText}</span>
            <div class="timer-buttons"> 
                <div class="timer">
                    <span class="timer-segment">${formattedTime}</span>
                </div>           
                <button class="btn-pause btn" onclick="pauseTimer(this)"><i class="fas fa-pause"></i></button>
                <button class="btn-play btn" onclick="startTimer(${timerValue}, this)"><i class="fas fa-play"></i></button>
                <button class="btn-restart btn" onclick="restartTimer(this, ${timerValue})"><i class="fas fa-refresh"></i></button>
            </div>
            <button id="rem-btn" onclick="removeTask(this.parentElement)"><i class="fas fa-remove" style="color: aliceblue;"></i></button>
        `
        taskList.appendChild(li);
        document.getElementById('taskInput').value = '';
        document.getElementById('timerInput').value = '';
        saveTasksToLocalStorage();
    }
    saveTasksToLocalStorage();
}

function removeTask(taskElement) {
    taskElement.remove();
    saveTasksToLocalStorage();
}

function completeTask(taskElement) {
    taskElement.classList.toggle('completed');
    saveTasksToLocalStorage();
}

function formatTime(timerValue) {
    const hours = Math.floor(timerValue);
    const minutes = Math.floor((timerValue - hours) * 60);
    const seconds = Math.floor((timerValue - hours - minutes / 60) * 3600);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Function to start a timer for a given number of hours
function startTimer(timerValue, buttonElement) {

    buttonElement.style.display = 'none'; // Hide the clicked button
    const parent = buttonElement.parentNode;
    const pauseButton = parent.querySelector('.btn-pause');
    pauseButton.style.display = 'block'; // Show the Pause button

    // Convert hours to seconds
    const totalSeconds = Math.floor(timerValue * 3600);

    // Get the timer-segment element to update
    const timerSegment = buttonElement.parentNode.querySelector(".timer-segment");

    // Check if the timer was previously paused
    if (isTimerPaused) {
        secondsRemaining = pausedSecondsRemaining;
        isTimerPaused = false;
    } else {
        secondsRemaining = totalSeconds; // Initialize or reset the remaining time
    }

    timerIntervalId = setInterval(() => {
        const hours = Math.floor(secondsRemaining / 3600);
        const minutes = Math.floor((secondsRemaining % 3600) / 60);
        const seconds = secondsRemaining % 60;

        // Update the timer-segment element
        timerSegment.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        secondsRemaining--;

        if (secondsRemaining == 0) {
            clearInterval(timerIntervalId); // Stop the timer
            buttonElement.disabled = false; // Enable the play button
            buttonElement.style.display = 'block'; 
            const parent = buttonElement.parentNode;
            const pauseButton = parent.querySelector('.btn-pause');
            pauseButton.style.display = 'none'; // Show the Pause button
            playRingtone(); // Play the ringtone
        }
    }, 1000); // Update every 1 second
}


function pauseTimer(buttonElement){
    buttonElement.style.display = 'none'; // Hide the clicked button
    const parent = buttonElement.parentNode;
    const playButton = parent.querySelector('.btn-play');
    playButton.style.display = 'block'; 

    if (timerIntervalId !== null) {
        clearInterval(timerIntervalId); // Stop the timer
        isTimerPaused = true;
        pausedSecondsRemaining = secondsRemaining;
    }
}

function restartTimer(buttonElement, initialTime) {
    const parentPlay = buttonElement.parentNode;
    const playButton = parentPlay.querySelector('.btn-play');
    playButton.style.display = 'block'; 

    const parentPause = buttonElement.parentNode;
    const pauseButton = parentPause.querySelector('.btn-pause');
    pauseButton.style.display = 'none'; 

    // Reset the timer variables to the initial time
    secondsRemaining = initialTime * 3600; // Convert hours to seconds

    // Update the timer-segment element to the initial time in the format "hh:mm:ss"
    const timerSegment = buttonElement.parentNode.querySelector(".timer-segment");
    const hours = Math.floor(initialTime);
    const minutes = Math.floor((initialTime - hours) * 60);
    const seconds = Math.floor((initialTime * 3600) % 60);
    timerSegment.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Clear the interval and reset pause state
    clearInterval(timerIntervalId);
    isTimerPaused = false;
    pausedSecondsRemaining = null;
}

function playRingtone() {
    // Get a reference to the audio element
    const ringtone = document.getElementById('ringtone');

    // Set the initial playback time (e.g., at 10 seconds)
    ringtone.currentTime = 3; // Set the initial time in seconds

    // Play the audio
    ringtone.play();

    // Stop the audio after a specific time (e.g., at 20 seconds)
    setTimeout(() => {
        ringtone.pause(); // Pause the audio
    }, 3500); // Stop after 5 seconds (20000 milliseconds)

}

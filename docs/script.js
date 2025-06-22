const socket = io();
const timerElement = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusElement = document.getElementById('status');

// Format time in MM:SS format
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Update timer display
function updateTimerDisplay(time) {
    timerElement.textContent = formatTime(time);
}

// Handle timer events
socket.on('update_timer', (data) => {
    updateTimerDisplay(data.time);
});

socket.on('timer_finished', (data) => {
    if (data.type === 'pomodoro') {
        statusElement.textContent = '休憩時間です！';
        statusElement.style.color = '#e74c3c';
        playSound('break');
    } else {
        statusElement.textContent = '作業時間です！';
        statusElement.style.color = '#2ecc71';
        playSound('pomodoro');
    }
});

// Play sound
function playSound(type) {
    const audio = new Audio();
    audio.src = type === 'break' ? 'https://notificationsounds.com/soundfiles/7873d934571c4a699449b90505325efe/file-sounds-1160-notify.mp3' : 
                 'https://notificationsounds.com/soundfiles/7873d934571c4a699449b90505325efe/file-sounds-1160-notify.mp3';
    audio.play();
}

// Button event handlers
startBtn.addEventListener('click', () => {
    socket.emit('start_timer');
    startBtn.disabled = true;
    stopBtn.disabled = false;
    statusElement.textContent = '';
});

stopBtn.addEventListener('click', () => {
    socket.emit('stop_timer');
    startBtn.disabled = false;
    stopBtn.disabled = true;
    statusElement.textContent = '';
});

// Initial state
stopBtn.disabled = true;

// タイマーメインコンポーネント
const timerElement = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusElement = document.getElementById('status');

// タイマーステート
let timer = null;
let timeLeft = 1500; // 25分
let isWorking = true;
let isRunning = false;

// 時間をMM:SS形式で表示
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// タイマーカウントダウン
function startTimer() {
    if (isRunning || timer) return; // タイマーが既に実行中の場合は無視
    
    isRunning = true;
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            // タイマーが0になった場合
            stopTimer();
            playSound();
            isWorking = !isWorking;
            statusElement.textContent = isWorking ? '作業時間です！' : '休憩時間です！';
            statusElement.style.color = isWorking ? '#2ecc71' : '#e74c3c';
            timeLeft = isWorking ? 1500 : 300; // 作業時間: 25分, 休憩時間: 5分
            startTimer(); // 新しいタイマーセッションを開始
        } else {
            timeLeft--;
            timerElement.textContent = formatTime(timeLeft);
        }
    }, 1000);
}

// タイマーストップ
function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    isRunning = false;
    timerElement.textContent = formatTime(timeLeft);
    statusElement.textContent = '';
    
    // ボタンの状態をリセット
    startBtn.disabled = false;
    stopBtn.disabled = true;
}

// サウンド再生
function playSound() {
    const audio = new Audio('https://notificationsounds.com/soundfiles/7873d934571c4a699449b90505325efe/file-sounds-1160-notify.mp3');
    audio.play();
}

// ボタンイベントハンドラー
startBtn.addEventListener('click', () => {
    if (!isRunning && !timer) {
        startTimer();
        startBtn.disabled = true;
        stopBtn.disabled = false;
    }
});

stopBtn.addEventListener('click', () => {
    stopTimer();
});

// イニシャルステートの設定
document.addEventListener('DOMContentLoaded', () => {
    timerElement.textContent = formatTime(timeLeft);
    stopBtn.disabled = true;
    
    // ボタンの初期状態を設定
    startBtn.disabled = false;
    stopBtn.disabled = true;
});

from flask import Flask, render_template
from flask_socketio import SocketIO
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)
socketio = SocketIO(app)

timer_running = False
current_time = 0
pomodoro_time = 25 * 60  # 25 minutes in seconds
break_time = 5 * 60      # 5 minutes in seconds

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('start_timer')
def handle_start_timer(data):
    global timer_running, current_time
    timer_running = True
    current_time = pomodoro_time
    
    while timer_running and current_time > 0:
        socketio.sleep(1)
        current_time -= 1
        socketio.emit('update_timer', {'time': current_time})
    
    if timer_running:
        socketio.emit('timer_finished', {'type': 'pomodoro'})
        
        # Start break timer
        current_time = break_time
        while timer_running and current_time > 0:
            socketio.sleep(1)
            current_time -= 1
            socketio.emit('update_timer', {'time': current_time})
        
        if timer_running:
            socketio.emit('timer_finished', {'type': 'break'})

@socketio.on('stop_timer')
def handle_stop_timer():
    global timer_running
    timer_running = False

if __name__ == '__main__':
    socketio.run(app, debug=True)

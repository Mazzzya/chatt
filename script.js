let socket;
let typingTimeout;

function connectWebSocket() {
    socket = new WebSocket('wss://lime-orange-sassafras.glitch.me/ws');

    socket.onopen = () => {
        console.log('Соединение установлено');
        loadMessages();
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'message') {
            displayMessage(data.username, data.message, data.time);
        } else if (data.type === 'typing') {
            displayTypingIndicator(data.username);
        }
    };

    socket.onclose = () => {
        console.log('Соединение закрыто. Переподключение...');
        setTimeout(connectWebSocket, 3000);
    };
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (message) {
        const data = { type: 'message', username: 'Гость', message, time: new Date().toLocaleTimeString() };
        socket.send(JSON.stringify(data));
        messageInput.value = '';
        clearTypingIndicator();
    }
}

function sendTypingStatus() {
    socket.send(JSON.stringify({ type: 'typing', username: 'Гость' }));
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(clearTypingIndicator, 3000);
}

function clearTypingIndicator() {
    socket.send(JSON.stringify({ type: 'typing', username: '' }));
}

function displayTypingIndicator(username) {
    const indicator = document.getElementById('typing-indicator');
    indicator.textContent = username ? `${username} набирает сообщение...` : '';
}

function displayMessage(username, message, time) {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.innerHTML = `<div class="chat-message"><span class="chat-user">${username}</span>: ${message}<span class="chat-time">${time}</span></div>`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function logout() {
    socket.close();
    window.location.href = 'index.html';
}

connectWebSocket();

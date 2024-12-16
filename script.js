const SERVER_URL = 'https://lime-orange-sassafras.glitch.me';
let socket;
let typingTimeout;

// Подключение к WebSocket
function connectWebSocket() {
    socket = new WebSocket(`${SERVER_URL.replace('http', 'ws')}/ws`);

    socket.onopen = () => console.log('Соединение установлено');

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'message') {
            displayMessage(data.username, data.message);
        } else if (data.type === 'typing') {
            displayTypingIndicator(data.username);
        }
    };

    socket.onclose = () => {
        console.log('Соединение закрыто, переподключение...');
        setTimeout(connectWebSocket, 3000);
    };
}

// Отображение сообщения
function displayMessage(username, message) {
    const chatBox = document.getElementById('chat-box');
    const msgElement = document.createElement('div');
    msgElement.textContent = `${username}: ${message}`;
    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Отправка сообщения
function sendMessage() {
    const message = document.getElementById('messageInput').value.trim();
    const username = localStorage.getItem('username') || 'Гость';

    if (message) {
        const data = { type: 'message', username, message };
        socket.send(JSON.stringify(data));
        document.getElementById('messageInput').value = '';
    }
}

// Индикация набора сообщения
function sendTypingStatus() {
    const username = localStorage.getItem('username') || 'Гость';
    socket.send(JSON.stringify({ type: 'typing', username }));

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        socket.send(JSON.stringify({ type: 'typing', username: '' }));
    }, 3000);
}

// Отображение статуса "набирает сообщение..."
function displayTypingIndicator(username) {
    const typingIndicator = document.getElementById('typing-indicator');
    if (username) {
        typingIndicator.textContent = `${username} набирает сообщение...`;
    } else {
        typingIndicator.textContent = '';
    }
}

// Выход из чата
function logout() {
    localStorage.removeItem('username');
    socket.close();
    window.location.href = 'index.html';
}

// Подключение при загрузке страницы
connectWebSocket();

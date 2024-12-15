// URL сервера Glitch
const SERVER_URL = 'https://lime-orange-sassafras.glitch.me';

// Авторизация пользователя
async function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        if (username && password) {
            alert(`Добро пожаловать, ${username}!`);
            showChat(username);
        } else {
            alert('Введите логин и пароль');
        }
    } catch (error) {
        console.error('Ошибка авторизации:', error);
    }
}

// Отобразить чат
function showChat(username) {
    document.getElementById('app').innerHTML = `
        <h1>Чат</h1>
        <div id="chat-box">
            <div id="messages" style="height: 300px; overflow-y: scroll;"></div>
            <input type="text" id="messageInput" placeholder="Введите сообщение">
            <button onclick="sendMessage('${username}')">Отправить</button>
        </div>
        <button onclick="location.reload()">Выйти</button>
    `;
    loadMessages();
    setInterval(loadMessages, 3000); // Обновление чата каждые 3 секунды
}

// Отправить сообщение
async function sendMessage(username) {
    const message = document.getElementById('messageInput').value.trim();
    if (message) {
        try {
            await fetch(`${SERVER_URL}/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, message }),
            });
            document.getElementById('messageInput').value = ''; // Очистка поля ввода
            loadMessages();
        } catch (error) {
            console.error('Ошибка отправки сообщения:', error);
        }
    } else {
        alert('Сообщение не может быть пустым');
    }
}

// Загрузить сообщения
async function loadMessages() {
    try {
        const response = await fetch(`${SERVER_URL}/messages`);
        const messages = await response.json();
        const messagesContainer = document.getElementById('messages');
        messagesContainer.innerHTML = '';

        messages.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.textContent = `${msg.username}: ${msg.message}`;
            messagesContainer.appendChild(messageElement);
        });

        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Автопрокрутка вниз
    } catch (error) {
        console.error('Ошибка загрузки сообщений:', error);
    }
}

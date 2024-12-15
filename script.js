const SERVER_URL = 'https://lime-orange-sassafras.glitch.me';

// Регистрация пользователя
async function register() {
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value.trim();

    if (username && password) {
        try {
            const response = await fetch(`${SERVER_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const result = await response.json();
            if (result.success) {
                alert('Регистрация успешна!');
                showLogin();
            } else {
                alert(result.error || 'Ошибка регистрации');
            }
        } catch (error) {
            console.error('Ошибка регистрации:', error);
        }
    } else {
        alert('Введите логин и пароль!');
    }
}

// Показать форму авторизации
function showLogin() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

// Авторизация пользователя
async function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (username && password) {
        try {
            const response = await fetch(`${SERVER_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const result = await response.json();
            if (result.success) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('username', username);
                window.location.href = 'chat.html'; // Переход в чат
            } else {
                alert(result.error || 'Ошибка авторизации');
            }
        } catch (error) {
            console.error('Ошибка авторизации:', error);
        }
    } else {
        alert('Введите логин и пароль!');
    }
}

// Загрузить сообщения
async function loadMessages() {
    try {
        const response = await fetch(`${SERVER_URL}/messages`);
        const messages = await response.json();
        const chatBox = document.getElementById('chat-box');
        chatBox.innerHTML = '';
        messages.forEach(msg => {
            const msgElement = document.createElement('div');
            msgElement.textContent = `${msg.username}: ${msg.message}`;
            chatBox.appendChild(msgElement);
        });
    } catch (error) {
        console.error('Ошибка загрузки сообщений:', error);
    }
}

// Отправить сообщение
async function sendMessage() {
    const message = document.getElementById('messageInput').value.trim();
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (message && token) {
        try {
            await fetch(`${SERVER_URL}/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify({ username, message }),
            });
            document.getElementById('messageInput').value = '';
            loadMessages();
        } catch (error) {
            console.error('Ошибка отправки сообщения:', error);
        }
    } else {
        alert('Сообщение не может быть пустым или вы не авторизованы');
    }
}

// Выйти из чата
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}

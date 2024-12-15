// Имитация базы данных
const usersDatabase = [
    { username: 'admin', password: 'admin123', role: 'admin' }, // Админ
    { username: 'user1', password: 'password1', role: 'user' }  // Обычный пользователь
];

// Функция авторизации
function login(username, password) {
    const user = usersDatabase.find(u => u.username === username && u.password === password);

    if (user) {
        console.log(`Добро пожаловать, ${user.username}!`);
        if (user.role === 'admin') {
            showAdminPanel();
        } else {
            showChat();
        }
    } else {
        alert('Неверный логин или пароль');
    }
}

// Обработчик формы входа
function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    login(username, password);
}

// Функции отображения интерфейсов
function showAdminPanel() {
    document.getElementById('app').innerHTML = `
        <h1>Админ-панель</h1>
        <p>Добро пожаловать, Администратор!</p>
        <button onclick="showChat()">Перейти в чат</button>
    `;
}

function showChat() {
    document.getElementById('app').innerHTML = `
        <h1>Чат</h1>
        <div id="chat-box">
            <div id="messages"></div>
            <input type="text" id="messageInput" placeholder="Введите сообщение">
            <button onclick="sendMessage()">Отправить</button>
        </div>
        <button onclick="showLogin()">Выйти</button>
    `;
}

function showLogin() {
    document.getElementById('app').innerHTML = `
        <div id="login-form">
            <h2>Авторизация</h2>
            <input type="text" id="username" placeholder="Логин">
            <input type="password" id="password" placeholder="Пароль">
            <button onclick="handleLogin()">Войти</button>
        </div>
    `;
}

// Логика отправки сообщений
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    if (message) {
        const messages = document.getElementById('messages');
        const messageElement = document.createElement('div');
        messageElement.textContent = `Вы: ${message}`;
        messages.appendChild(messageElement);
        messageInput.value = '';
    }
}

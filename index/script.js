// Ваш API-ключ от OpenWeatherMap (замените на свой)
const API_KEY = 'ВАШ_API_КЛЮЧ';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Элементы DOM
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherInfo = document.getElementById('weatherInfo');

// Обработчик клика по кнопке поиска
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        showError('Введите название города');
    }
});

// Функция получения погоды
async function fetchWeather(city) {
    try {
        const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=ru`);
        
        if (!response.ok) {
            throw new Error('Город не найден');
        }
        
        const data = await response.json();
        displayWeather(data);
        
    } catch (error) {
        showError(error.message);
    }
}

// Отображение информации о погоде
function displayWeather(data) {
    const { name, main, weather, wind } = data;
    
    weatherInfo.innerHTML = `
        <p class="city">${name}</p>
        <p class="temp">${Math.round(main.temp)}°C</p>
        <p><strong>Погода:</strong> ${weather[0].description}</p>
        <p><strong>Давление:</strong> ${main.pressure} гПа</p>
        <p><strong>Влажность:</strong> ${main.humidity}%</p>
        <p><strong>Ветер:</strong> ${wind.speed} м/с</p>
    `;
}

// Вывод ошибки
function showError(message) {
    weatherInfo.innerHTML = `<p style="color: red;">${message}</p>`;
}

// Загрузка погоды для текущего местоположения (опционально)
window.onload = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            fetch(`${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ru`)
                .then(response => response.json())
                .then(data => displayWeather(data))
                .catch(() => showError('Не удалось определить местоположение'));
        }, () => showError('Местоположение недоступно'));
    }
};

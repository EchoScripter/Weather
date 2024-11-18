const userLocation = document.getElementById("userLocation"),
    converter = document.getElementById("converter"),
    weatherIcon = document.querySelector(".weatherIcon"),
    temperature = document.querySelector(".temperature"),
    feelsLike = document.querySelector(".feelsLike"),
    description = document.querySelector(".description"),
    date = document.querySelector(".date"),
    city = document.querySelector(".city"),
    HValue = document.getElementById("HValue"),
    WValue = document.getElementById("WValue"),
    SRValue = document.getElementById("SRValue"),
    SSValue = document.getElementById("SSValue"),
    CValue = document.getElementById("CValue"),
    UVValue = document.getElementById("UVValue"),
    PValue = document.getElementById("PValue"),
    Forecast = document.querySelector(".Forecast");

const APIKEY = '64f2301c872493dfd69bc2a5d94d5a70';
const WEATHER_API_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?appid=${APIKEY}&q=`;
const WEATHER_DATA_ENDPOINT = `https://api.openweathermap.org/data/3.0/onecall?appid=${APIKEY}&exclude=minutely&units=metric&`;
const REVERSE_GEO_ENDPOINT = `https://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit=1&appid=${APIKEY}`;

// Listen for the "Enter" key on the input field
userLocation.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        findUserLocation();
    }
});

// Event listener for temperature unit change
converter.addEventListener("change", findUserLocation);

function findUserLocation() {
    Forecast.innerHTML = "";
    const locationInput = userLocation.value.trim();

    if (locationInput === "") {
        getCurrentLocation();
    } else {
        fetchWeatherByCity(locationInput);
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                fetch(REVERSE_GEO_ENDPOINT.replace('{lat}', latitude).replace('{lon}', longitude))
                    .then(response => response.json())
                    .then(data => {
                        city.innerHTML = data.length > 0 ? data[0].name : "Unknown location";
                        fetchWeatherData(longitude, latitude);
                    })
                    .catch(error => {
                        console.error("Error with reverse geocoding:", error);
                        city.innerHTML = "Unknown location";
                    });
            },
            () => alert("Unable to retrieve your location. Please allow location access.")
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function fetchWeatherByCity(cityName) {
    fetch(WEATHER_API_ENDPOINT + cityName)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200) {
                alert(data.message);
                return;
            }
            city.innerHTML = data.name;
            fetchWeatherData(data.coord.lon, data.coord.lat);
        })
        .catch(err => {
            console.error(err);
            alert("Error fetching data. Please try again.");
        });
}

function fetchWeatherData(lon, lat) {
    fetch(WEATHER_DATA_ENDPOINT + `lon=${lon}&lat=${lat}`)
        .then(response => response.json())
        .then(data => {
            if (data.cod && data.cod !== 200) {
                alert(data.message);
                return;
            }
            displayCurrentWeather(data);
            displayForecast(data.daily);
        });
}

function displayCurrentWeather(data) {
    weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png)`;
    temperature.innerHTML = TemConverter(data.current.temp);
    feelsLike.innerHTML = "Feels like " + TemConverter(data.current.feels_like);
    description.innerHTML = `<i class="fa-brands fa-cloudversify"></i> &nbsp;${data.current.weather[0].description}`;

    const options1 = { hour: "numeric", minute: "numeric", hour12: true };
    date.innerHTML = getLongFormateDateTime(data.current.dt, data.timezone_offset, options1);
    HValue.innerHTML = Math.round(data.current.humidity) + "<span>%</span>";
    WValue.innerHTML = Math.round(data.current.wind_speed) + "<span>m/s</span>";
    SRValue.innerHTML = getLongFormateDateTime(data.current.sunrise, data.timezone_offset, options1);
    SSValue.innerHTML = getLongFormateDateTime(data.current.sunset, data.timezone_offset, options1);
    CValue.innerHTML = data.current.clouds + "<span>%</span>";
    UVValue.innerHTML = data.current.uvi;
    PValue.innerHTML = data.current.pressure + "<span>hPa</span>";
}
// Update the background of the .weather-input section based on the weather type

function updateBackground(weatherType) {
    const weatherInput = document.querySelector('.weather-input');

    // Reset background color
    weatherInput.style.background = '';
    weatherInput.style.transition = 'background 0.5s ease'; // Smooth transition for background change

    // Apply modern backgrounds based on weather type
    switch (weatherCondition) {
        case 'Clear':
            weatherInput.style.background = 'linear-gradient(to right, #08616d, #1fa2ff, #f9d423)'; // Transition from dark teal to bright blue and golden yellow
            weatherInput.style.boxShadow = '0px 8px 30px rgba(249, 212, 35, 0.5), 0px 0px 15px rgba(31, 162, 255, 0.7)'; // Dual glow for warmth and clarity
            break;
        case 'Clouds':
            weatherInput.style.background = 'linear-gradient(to right, #bdc3c7, #2c3e50)'; // Modern cloudy gradient with depth
            weatherInput.style.boxShadow = '0px 8px 25px rgba(44, 62, 80, 0.3)';
            break;
        case 'Rain':
        case 'Drizzle':
            weatherInput.style.background = 'linear-gradient(to right, #4b79a1, #283e51)'; // Moody rainy tones
            weatherInput.style.boxShadow = '0px 8px 25px rgba(0, 47, 75, 0.3)';
            break;
        case 'Thunderstorm':
            weatherInput.style.background = 'linear-gradient(to right, #0f2027, #203a43, #2c5364)'; // Dramatic stormy gradient
            weatherInput.style.boxShadow = '0px 8px 25px rgba(20, 30, 40, 0.4)';
            break;
        case 'Snow':
            weatherInput.style.background = 'linear-gradient(to right, #e0eafc, #cfdef3)'; // Soft icy colors for snow
            weatherInput.style.boxShadow = '0px 8px 25px rgba(207, 222, 243, 0.3)';
            break;
        case 'Mist':
        case 'Fog':
            weatherInput.style.background = 'linear-gradient(to right, #606c88, #3f4c6b)'; // Smooth and hazy fog gradient
            weatherInput.style.boxShadow = '0px 8px 25px rgba(60, 76, 107, 0.3)';
            break;
        default:
            weatherInput.style.background = 'linear-gradient(to right, #ff758c, #ff7eb3)'; // Default vibrant modern gradient
            weatherInput.style.boxShadow = '0px 8px 25px rgba(255, 126, 179, 0.4)';
            break;
    }
    
    // Optional: Adding a text color change for better contrast on different backgrounds
    weatherInput.style.color = getTextColorBasedOnBackground(weatherInput.style.background);
}

// Helper function to dynamically change text color based on background brightness
function getTextColorBasedOnBackground(background) {
    // You can implement a basic brightness check or use a color contrast library
    const rgb = background.match(/\d+/g);
    const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
    return brightness > 155 ? 'black' : 'white';
}

function displayForecast(dailyData) {
    dailyData.forEach(weather => {
        let div = document.createElement("div");
        const options = { weekday: 'long', month: 'long', day: "numeric" };
        const dailyDate = getLongFormateDateTime(weather.dt, 0, options).split(" at ")[0];

        // Call the updateBackground function to change the background based on weather type for each day
        updateBackgroundForecast(div, weather.weather[0].main);

        div.innerHTML = `
            ${dailyDate}
            <img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png"/>
            <p class="forecast-desc">${weather.weather[0].description}</p>
            <span>
                <span>${TemConverter(weather.temp.min)}</span>
                &nbsp;&nbsp;
                <span>${TemConverter(weather.temp.max)}</span>
            </span>`;

        Forecast.append(div);
    });
}

// Update the background of the forecast card based on the weather type
function updateBackgroundForecast(forecastDiv, weatherType) {
    // Reset background color
    forecastDiv.style.background = '';

    switch (weatherType) {
        case 'Clear':
            forecastDiv.style.background = 'linear-gradient(to right, #ff7e5f, #feb47b)'; // Sunset
            break;
        case 'Clouds':
            forecastDiv.style.background = 'linear-gradient(to right, #a2c2e1, #5d6d7e)'; // Cloudy
            break;
        case 'Rain':
        case 'Drizzle':
            forecastDiv.style.background = 'linear-gradient(to right, #4b6cb7, #182848)'; // Rainy
            break;
        case 'Thunderstorm':
            forecastDiv.style.background = 'linear-gradient(to right, #636fa4, #4f82ff)'; // Thunderstorm
            break;
        case 'Snow':
            forecastDiv.style.background = 'linear-gradient(to right, #00c6ff, #0072ff)'; // Snowy
            break;
        case 'Mist':
        case 'Fog':
            forecastDiv.style.background = 'linear-gradient(to right, #c0c0c0, #7f8c8d)'; // Misty/Foggy
            break;
        default:
            forecastDiv.style.background = 'linear-gradient(to right, #78c1f3, #4fa3d1)'; // Default background
            break;
    }
}


function formatUnixTime(dtValue, offset, options = {}) {
    const dateObj = new Date((dtValue + offset) * 1000);
    return dateObj.toLocaleTimeString([], { timeZone: "UTC", ...options });
}

function getLongFormateDateTime(dtValue, offset, options) {
    return formatUnixTime(dtValue, offset, options);
}

function TemConverter(temp) {
    let tempValue = Math.round(temp);
    return converter.value === "°C" 
        ? `${tempValue}<span>°C</span>` 
        : `${(tempValue * 9) / 5 + 32}<span>°F</span>`;
}

findUserLocation();

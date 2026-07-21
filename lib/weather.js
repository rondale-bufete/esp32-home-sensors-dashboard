const LATITUDE = 13.558920;
const LONGITUDE = 123.373642;
const LOCATION_NAME = "Ocampo, Camarines Sur, PH";


const WEATHER_CODES = {
    0: { label: "Clear sky", icon: "☀️" },
    1: { label: "Mainly clear", icon: "🌤️" },
    2: { label: "Partly cloudy", icon: "⛅" },
    3: { label: "Overcast", icon: "☁️" },
    45: { label: "Fog", icon: "🌫️" },
    48: { label: "Fog", icon: "🌫️" },
    51: { label: "Light drizzle", icon: "🌦️" },
    53: { label: "Drizzle", icon: "🌦️" },
    55: { label: "Dense drizzle", icon: "🌦️" },
    61: { label: "Light rain", icon: "🌧️" },
    63: { label: "Rain", icon: "🌧️" },
    65: { label: "Heavy rain", icon: "🌧️" },
    71: { label: "Light snow", icon: "🌨️" },
    73: { label: "Snow", icon: "🌨️" },
    75: { label: "Heavy snow", icon: "🌨️" },
    80: { label: "Rain showers", icon: "🌦️" },
    81: { label: "Rain showers", icon: "🌦️" },
    82: { label: "Violent rain showers", icon: "⛈️" },
    95: { label: "Thunderstorm", icon: "⛈️" },
    96: { label: "Thunderstorm, hail", icon: "⛈️" },
    99: { label: "Thunderstorm, hail", icon: "⛈️" },
};

function getWeatherInfo(code) {
    return WEATHER_CODES[code] || { label: "Unknown", icon: "❓" };
}

export async function getOutdoorWeather() {
    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code,is_day` +
        `&hourly=temperature_2m,weather_code,precipitation_probability` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
        `&timezone=auto&forecast_days=7`;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Failed to fetch weather data");
    }

    const data = await res.json();
    const info = getWeatherInfo(data.current.weather_code);

    const current = {
        temperature: data.current.temperature_2m,
        apparentTemperature: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        isDay: data.current.is_day === 1,
        condition: info.label,
        icon: info.icon,
        time: data.current.time,
        timezoneAbbreviation: data.timezone_abbreviation,
        locationName: LOCATION_NAME,
    };

    // Find the index of the current hour, then take the next 6 hours from there
    const nowIndex = data.hourly.time.findIndex((t) => t === data.current.time.slice(0, 13) + ":00");
    const startIndex = nowIndex >= 0 ? nowIndex : 0;

    const hourly = data.hourly.time
        .slice(startIndex, startIndex + 6)
        .map((time, i) => {
            const idx = startIndex + i;
            const info = getWeatherInfo(data.hourly.weather_code[idx]);
            return {
                time,
                temperature: data.hourly.temperature_2m[idx],
                precipitationProbability: data.hourly.precipitation_probability[idx],
                icon: info.icon,
                condition: info.label,
            };
        });

    const daily = data.daily.time.map((date, i) => {
        const info = getWeatherInfo(data.daily.weather_code[i]);
        return {
            date,
            tempMax: data.daily.temperature_2m_max[i],
            tempMin: data.daily.temperature_2m_min[i],
            precipitationProbability: data.daily.precipitation_probability_max[i],
            icon: info.icon,
            condition: info.label,
        };
    });

    return { current, hourly, daily };
}
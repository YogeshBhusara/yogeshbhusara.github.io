/**
 * Pune weather card – fetches current weather and AQI from Open-Meteo (no API key).
 */
(function () {
  'use strict';

  const PUNE_LAT = 18.52;
  const PUNE_LON = 73.86;
  const WEATHER_URL =
    'https://api.open-meteo.com/v1/forecast?latitude=' + PUNE_LAT + '&longitude=' + PUNE_LON +
    '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature' +
    '&timezone=Asia%2FKolkata';
  const AQI_URL =
    'https://air-quality.api.open-meteo.com/v1/air-quality?latitude=' + PUNE_LAT + '&longitude=' + PUNE_LON +
    '&current=us_aqi,pm10,pm2_5';

  const weatherCodeLabels = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  };

  function aqiLabel(aqi) {
    if (aqi == null) return '';
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for sensitive';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very unhealthy';
    return 'Hazardous';
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function renderWeather(weather, aqi) {
    const cur = weather && weather.current;
    const aqiCur = aqi && aqi.current;

    if (cur) {
      setText('weather-temp', Math.round(cur.temperature_2m));
      setText('weather-desc', weatherCodeLabels[cur.weather_code] || 'Unknown');
      setText('weather-feels', Math.round(cur.apparent_temperature));
      setText('weather-humidity', cur.relative_humidity_2m);
      setText('weather-wind', Math.round(cur.wind_speed_10m));
    }

    if (aqiCur && aqiCur.us_aqi != null) {
      setText('weather-aqi', aqiCur.us_aqi);
      setText('weather-aqi-label', aqiLabel(aqiCur.us_aqi));
    }
  }

  function load() {
    const card = document.getElementById('weather-card');
    if (!card) return;

    setText('weather-desc', 'Loading…');

    fetch(WEATHER_URL)
      .then(function (r) {
        if (!r.ok) throw new Error('Weather API error');
        return r.json();
      })
      .then(function (weather) {
        renderWeather(weather, null);
      })
      .catch(function () {
        setText('weather-temp', '--');
        setText('weather-desc', '--');
        setText('weather-feels', '--');
        setText('weather-humidity', '--');
        setText('weather-wind', '--');
        setText('weather-aqi', '--');
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();

'use strict';

let cache = require('./cache.js');

module.exports = getWeather;

//add superagent
const superagent = require('superagent');

function getWeather(lat, lon) {
  const key = 'weather-' + lat + lon;
  const url = 'http://api.weatherbit.io/v2.0/forecast/daily';
  const queryParams = {
    key: process.env.WEATHER_API_KEY,
    lang: 'en',
    //change to match key format
    lat: lat,
    lon: lon,
    days: 5,
  };

  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    //add query parameters for weather
    cache[key].data = superagent.get(url).query(queryParams)
    .then(response => parseWeather(response.body));
  }
  
  return cache[key].data;
}

function parseWeather(weatherData) {
  try {
    const weatherSummaries = weatherData.data.map(day => {
      return new Weather(day);
    });
    return Promise.resolve(weatherSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

class Weather {
  constructor(day) {
    this.description = day.weather.description;
    this.date = day.datetime;
    this.high = day.high_temp;
    this.low = day.low_temp;
  }
}

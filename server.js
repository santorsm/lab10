'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const weather = require('./modules/weather.js');
const app = express();

app.use(cors());
const PORT = process.env.PORT || 3001;

app.get('/', (request, response) => {
  response.status(200).send('Hello, this is Lab 10');
});

app.get('/weather', weatherHandler);

function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  // console.log(request.query)
  weather(lat, lon)
  .then(summaries => {
    // console.log(summaries);
    response.send(summaries)})
  .catch((error) => {
    console.error(error);
    response.status(200).send('Sorry. Something went wrong!')
  });
}  

app.listen(PORT, () => console.log(`Server up on ${PORT}`));

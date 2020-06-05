require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const rp = require('request-promise')

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, boilerplate!');
});

app.get('/scalyr', (req, res) => {
  rp('https://app.scalyr.com/api/query?queryType=log&filter=$env%20%3D%3D%20"prod"%20$service%20%3D%3D%20"processing-http"%20metric%3D%27proc.stat.cpu_rate%27%20$source%3D%27tsdb%27%20type%3D%27user%27&startTime=72%20hours&token=0jiwKYTad02yVy90Qex0EziKmSUkjfcA75uWMk5rd_N8-')
  .then((res) => {
    console.log(res)
    !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
  })
  .then((res) => {
    res.status(200).send(res)
  })
})

app.use(function errorHandler(error, req, res, next) {
  let response;

  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error'} };
  }

  else {
    console.error(error);
    response = { message: error.message, error };
  }

  res.status(500).json(response);
});

module.exports = app;
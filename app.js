'use strict';

/* Module Dependencies */
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const compression = require('compression');

/* Route Controllers */
const index = require('./routes/index.js');

/* time in miliseconds const oneDay = 86400000; */
const oneMinute = 60000;

/* Express Application */
const app = express();
app.use(compression());

/* View Engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 0 }));

/* HTTP page routing */
app.use(index);

/* Catch 404 error and forward to error handler */
app.use((request, response, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

/* Production error handler without stacktraces leaking to user */
app.use((error, request, response, next) => {
  response.status(error.status || 500);
  response.render('error', { message: error.message, error: {} });
});

/* export app.environment helper function in order to disallow certain database actions */
exports.appEnvironment = function appEnvironment() {
  return app.get('env');
};

module.exports = app;

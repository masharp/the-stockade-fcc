/*jshint esnext: true */

(function() {
  'use strict';

  /* Module Dependencies */
  const express = require('express');
  const path = require('path');
  const favicon = require('serve-favicon');
  const logger = require('morgan');
  const bodyParser = require('body-parser');
  const compression = require('compression');
  const dotenv = require('dotenv').config();
  const session = require('express-session');

  /* Route Controllers */
  const index = require('./routes/index.js');

  /* Express Application */
  const app = express();
  app.use(compression());

  /* Express-Session session setup */
  app.use(session({
    name: 'the-stockade0.0.1',
    secret: 'm-l-h-93',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 900000 }
  }));

  /* View Engine setup */
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, 'public')));

  /*CORS fix for a cross origin errr I was getting on mobile
  app.use(function(request, response, next) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  }); */

  /* HTTP page routing */
  app.use('/', index);
  app.use('/api', index);

  /* Catch 404 error and forward to error handler */
  app.use(function(request, response, next) {
    let error = new Error('Not Found');
    error.status = 404;
    next(error);
  });

  /*
   * Error Handlers
   */
  /* Development error handler that prints a stack trace */
  if (app.get('env') === 'development') {
    app.use(function(error, request, response, next) {
      response.status(error.status || 500);
      response.render('error', {
        message: error.message,
        error: error
      });
    });
  }

  /* Production error handler without stacktraces leaking to user */
  app.use(function(error, request, response, next) {
    response.status(error.status || 500);
    response.render('error', {
      message: error.message,
      error: {}
    });
  });

  //export app.environment helper function in order to disallow certain database actions
  exports.appEnvironment = function() {
    return app.get('env');
  };

  module.exports = app;
})();

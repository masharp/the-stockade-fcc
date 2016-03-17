/*jshint esnext: true */
'use strict';

/* HTTP Routing */
const express = require('express');
const router = express.Router();
const db = require('../db');
const app = require('../app');

/* Home Page */
router.get('/', function(request, response) {
  response.render('home', { title: 'The Stockade | Stock Market Watching' });
});

/* API Access Point */
router.get('/api', function(request, response) {
  console.log('GET API');
  response.end();
});

module.exports = router;

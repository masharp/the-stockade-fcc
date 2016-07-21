'use strict';

/* HTTP Routing */
const express = require('express');
const router = express.Router();

/* Home Page */
router.get('/', function(request, response) {
  response.render('home', { title: 'The Stockade | Stock Market Watcher by Michael Sharp' });
});

module.exports = router;

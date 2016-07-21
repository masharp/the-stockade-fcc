'use strict';

/* HTTP Routing */
const express = require('express');
const router = express.Router();

/* API Access Point */
router.get('/api', function(request, response) {
  console.log('GET API');
  response.end();
});

module.exports = router;

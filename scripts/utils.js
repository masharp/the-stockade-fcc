'use strict';

const db = require('../scripts/db');

const MONGO_URL = process.env.MONGODB_URI;
const MARKIT_LOOKUP = process.env.MARKIT_LOOKUP_URL;
const MARKIT_INTERACTIVE = process.env.MARKIT_INTERACTIVE_URL;

/* Test if an input stock symbol is valid and/or assume probable if close */
module.exports.testValidSymbol = function testValidSymbol(symbol) {
  console.log('TEST SYMBOL');

  return {};
}

module.exports.fetchStockData = function fetchStockData() {
  console.log('FETCH DATA');

  return {};
}

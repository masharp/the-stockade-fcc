'use strict';

const db = require('../scripts/db');

const MONGO_URL = process.env.MONGODB_URI;
const MARKIT_LOOKUP = process.env.MARKIT_LOOKUP_URL;
const MARKIT_INTERACTIVE = process.env.MARKIT_INTERACTIVE_URL;

module.exports.fetchSymbols = function fetchSymbols() {
  const url = `${MARKIT_INTERACTIVE}/jsonp`;
  let symbols = { list: null, url };

  return new Promise((resolve, reject) => {
    db.fetchSymbols(MONGO_URL).then((fetched) => {
      symbols.list = fetched;

      resolve(symbols);
    });
  });
}

module.exports.addSymbol = function addSymbol(symbol) {
  testValidSymbol(symbol);

  return {};
}

module.exports.removeSymbol = function removeSymbol(symbol) {

}

/* Test if an input stock symbol is valid and/or assume probable if close */
function testValidSymbol(symbol) {

  return {};
}

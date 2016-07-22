'use strict';

const db = require('../scripts/db');

const MONGO_URL = process.env.MONGODB_URI;
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
  return new Promise((resolve, reject) => {
    db.addSymbolEntry(MONGO_URL, symbol).then((update) => {
      if (update === 'success') resolve(true);
      else if (update === 'duplicate') resolve('Duplicate Symbol');
    });
  });
}

module.exports.removeSymbol = function removeSymbol(symbol) {
  return new Promise((resolve, reject) => {
    db.removeSymbolEntry(MONGO_URL, symbol).then((update) => {
      resolve(update);
    });
  });
}

'use strict';

const MongoClient = require('mongodb').MongoClient;

module.exports.fetchSymbols = function getSymbols(url) {
  return new Promise( (resolve, reject) => {

    MongoClient.connect(url, (mongoError, db) => {
      if (mongoError) reject(mongoError);

      db.collection('stockade-symbols', (collectionError, collection) => {
        if (collectionError) reject(collectionError);

          collection.findOne({ name: 'dev'}, (itemError, item) => {
            if (itemError) reject(itemError);

            db.close();
            resolve(item.symbols);
          });
      });
    });
  });
}

module.exports.addSymbolEntry = function addSymbolEntry(url, symbol) {
  return new Promise((resolve, reject) => {

    MongoClient.connect(url, (mongoError, db) => {
      if (mongoError) reject(mongoError);

      db.collection('stockade-symbols', (collectionError, collection) => {
        if (collectionError) reject(collectionError);

        collection.findOne({ name: 'dev' }, (itemError, item) => {
            if (itemError) reject(itemError);

            /* check if symbol already exisits or # of symbols === 6 (max for API) */
            if (item.symbols.indexOf(symbol) >= 0) {
              db.close();
              resolve('duplicate');
            } else if (item.symbols.length === 6) {
              db.close();
              resolve('maximum');
            }
            else {
              collection.update({ name: 'dev' }, { $push: { symbols: symbol } }, (updateError, result) => {
                  if (updateError) reject(updateError);

                  db.close();
                  resolve('success');
              });
            }
        });
      });
    });
  });
}

module.exports.removeSymbolEntry = function removeSymbolEntry(url, symbol) {
  return new Promise((resolve, reject) => {

    MongoClient.connect(url, (mongoError, db) => {
      if (mongoError) reject(mongoError);

      db.collection('stockade-symbols', (collectionError, collection) => {
        if (collectionError) reject(collectionError);

        collection.update( { name: 'dev' }, { $pull: { symbols: symbol } }, (updateError, result) => {
          if (updateError) reject(updateError);

          db.close();
          resolve('success');
        });
      });
    });
  });
}

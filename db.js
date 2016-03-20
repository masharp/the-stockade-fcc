'use strict';
const dotenv = require('dotenv').config();
const MONGO_URL = process.env.MONGOLAB_URI;

/* Configure MongoDB */
const MongoClient = require('mongodb').MongoClient;

module.exports.getSymbols = function getSymbols() {
  return new Promise( (resolve, reject) => {

    MongoClient.connect(MONGO_URL, (error, db) => {
      if(error) reject(error);

      db.collection('symbols', (error, collection) => {
        if(error) reject(error);

          collection.findOne({ name: 'master'}, (error, item) => {
            if(error) reject(error);

            db.close();
            resolve(item);
          });
      });
    });
  });
}

module.exports.updateSymbols = function updateSymbols(mode, symbol) {
  return new Promise((resolve, reject) => {

    MongoClient.connect(MONGO_URL, (error, db) => {
      if(error) reject(error);

      db.collection('symbols', (error, collection) => {
        if(error) reject(error);

        switch(mode) {
          case 'ADD':
            collection.update( { name: 'master' },
              {
                $push : { list : symbol }
              }, (error, result) => {
                if(error) reject(error);
                console.log(result);
                db.close();
                resolve('Success');
            });
            break;
          case 'REMOVE':
            collection.update( { name: 'master' },
              {
                $pull : { list: symbol }
              }, (error, result) => {
                if(error) reject(error);
                console.log(result);
                db.close();
                resolve('Success');
              });
            break;
        }
      })
    })
  });
}

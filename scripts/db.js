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
            collection.findOne({ name: 'master' }, (error, item) => {
              if(error) reject(error);

              if(item.list.includes(symbol)) {
                resolve('Duplicate');
              } else {
                collection.update( { name: 'master' },
                  {
                    $push : { list : symbol }
                  }, (error, result) => {
                    if(error) reject(error);

                    db.close();
                    resolve('Success');
                });
              }
            });
            break;
          case 'REMOVE':
            collection.update( { name: 'master' },
              {
                $pull : { list: symbol }
              }, (error, result) => {
                if(error) reject(error);

                db.close();
                resolve('Success');
              });
            break;
        }
      })
    })
  });
}


function fetchStockData() {
  //STOCK DATA PROMISE
  return new Promise( (resolve, reject) => {

    //DATABASE GET STOCK SYMBOLS PROMISE
    db.getSymbols().then((result) => {

      if(result) {
        let stockData = [];
        let finished = 0;

        for(let i = 0; i < result.list.length; i++) {
          let requestString = BASE_URL + result.list[i] + URL_FORMATTER;

          request.get(requestString, (error, response, body) => {
            if(error) reject(error);

            let stockObj = {
              name: result.list[i],
              data: []
            };

            JSON.parse(body).dataset_data.data.forEach((d) => {
              let temp = [ Date.parse(d[0]), d[1] ];

              stockObj.data.push(temp);
            });

            stockData.push(stockObj);

            console.log(`${result.list[i]} parsed. Finished: ${finished}`);
            if(++finished === result.list.length) resolve(stockData);
          });
        }
      }
    });
  });
}

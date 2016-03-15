/*jshint esnext: true */
"use strict";
const dotenv = require("dotenv").config();
const MONGO_URL = process.env.MONGOLAB_URI;

/* Configure MongoDB */
const MongoClient = require("mongodb").MongoClient;

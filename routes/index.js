/*jshint esnext: true */
"use strict";

/* HTTP Routing */
const express = require("express");
const router = express.Router();
const db = require("../db");
const dotenv = require("dotenv").config();
const app = require("../app");


/* Home Page */
router.get("/", function(request, response) {
  response.render("home", { title: "The Stockade | Stock Market Watching" });
});

module.exports = router;

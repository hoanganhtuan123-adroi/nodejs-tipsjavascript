const express = require('express');
const app = express();
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

// init middleware
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())

// init db
require("./dbs/init.mongodb.js");
// init routes
app.get("/learn", (req, res, next) => {
    return res.status(200).json({
        message: "Welcome to the API"
    });
});
// handle errors

module.exports = app; 
const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const router = require("./routes/index.js");
// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init db
require("./dbs/init.mongodb.js");

// init routes
app.use("/", require("./routes/index.js"));

// handle errors
app.use((req,res,next) => {
    const error = new Error("Not found");
    error.status = 404
    next(error);
})


app.use((err, req,res,next) => {
   const statusCode = err.status || 500
   return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: err.message || "internal server error",
   })
})


module.exports = app;

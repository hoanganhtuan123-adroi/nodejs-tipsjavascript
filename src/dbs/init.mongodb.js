"use strict";
const mongoose = require("mongoose");
const {db:{host,port,name}} = require("../configs/config.mongodb.js");
const connectString = `mongodb://${host}:${port}/${name}`;
const { countConnect } = require("../helpers/check.connect.js");
class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose.mongoose
      .connect(connectString, {maxPoolSize: 50})
      .then(() => {
        console.log("Connect to MongoDB: ", connectString);
        console.log("MongoDB connected successfully ");
        countConnect();
      })
      .catch((err) => console.error("MongoDB connection error:", err));
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongoDB = Database.getInstance();
module.exports = instanceMongoDB;

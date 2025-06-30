"use strict";
const mongoose = require("mongoose");
const _SECONDES = 5000;
const os = require("os");
//count connects
const countConnect = () => {
  const numConnections = mongoose.connections.length;
  console.log(`Number of connections: ${numConnections}`);
};

// check over connect
const checkOverConnect = ()=>{
    setInterval(()=>{
        const numConnect = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        const maxConnections = numCores * 3; // Example threshold
        console.log(`Number of connections: ${numConnect}`);
        console.log(`Memory usage : ${memoryUsage / 1024 / 1024} MB`);
        if (numConnect > maxConnections) {
            console.log("Connection overload detected!");
        }
    }, _SECONDES);
}

module.exports = { countConnect, checkOverConnect };

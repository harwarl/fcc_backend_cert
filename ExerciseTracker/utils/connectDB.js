const mongoose = require("mongoose");

function connectDB() {
  mongoose
    .connect("mongodb://localhost:27017/exerciseTracker")
    .then(() => {
      console.log(`DB connected successfully`);
    })
    .catch((error) => {
      console.log(`error: ${error.message}`);
    });
}

module.exports = connectDB;

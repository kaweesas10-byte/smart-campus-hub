const mongoose = require('mongoose');

async function runTest() {
  await mongoose.connect('mongodb://127.0.0.1:27017/smart_campus_hub');
  
  // Define a quick model or use your existing one to insert data
  console.log("Connected to database from terminal script!");
  
  // Close connection when done
  mongoose.connection.close();
}

runTest();
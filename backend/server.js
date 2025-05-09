const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: "./config.env" });

// MongoDB connection
const DB = process.env.DATABASE_LOCAL;
console.log(DB);

mongoose.connect(DB).then(() => {
  console.log("DB connection Successful");
});

// Start server
const port = 8000;
app.listen(port, () => {
  console.log(`App Running on port: ${port}`);
});

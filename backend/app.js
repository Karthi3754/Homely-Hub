const express = require("express");
const propertyRoutes = require("./routes/propertyRoutes");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware
const path = require('path');
app.use('/Database', express.static(path.join(__dirname, 'Database')));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/rent/listing", propertyRoutes);
app.use("/api/v1/rent/user", userRoutes);

app.get('/', (req, res) => {
  res.send('Service is live!');
});


module.exports = app;

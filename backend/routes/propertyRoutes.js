const express = require("express");
const propertyController = require("../controllers/propertyController");
const authController = require("../controllers/authController");

const router = express.Router();

// Route: GET all properties
router.get("/", propertyController.getProperties);

// Route: GET a specific property by ID
router.get("/:id", propertyController.getProperty);

module.exports = router;

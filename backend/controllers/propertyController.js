const Property = require("../Models/propertyModel");
const APIFeatures = require("../utils/APIFeatures");

// Get a single property by ID
exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: property
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message
    });
  }
};

// Create a new property
exports.createProperty = async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      userId: req.user.id
    };
    const newProperty = await Property.create(propertyData);

    res.status(200).json({
      status: "success",
      data: {
        data: newProperty
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message
    });
  }
};

// Get all properties with filtering, searching, and pagination
exports.getProperties = async (req, res) => {
  try {
    const apiFeatures = new APIFeatures(Property.find(), req.query)
      .filter()
      .search()
      .paginate();

    const allProperties = await Property.find(); // For total count
    const filteredProperties = await apiFeatures.query;

    res.status(200).json({
      status: 'success',
      no_of_responses: filteredProperties.length,
      all_Properties: allProperties.length,
      data: filteredProperties
    });
  } catch (err) {
    console.error("Error searching properties:", err);
    res.status(500).json({
      error: "Internal server error"
    });
  }
};

// Get properties created by the currently logged-in user
exports.getUsersProperties = async (req, res) => {
  try {
    const userId = req.user._id;
    const userProperties = await Property.find({ userId });

    res.status(200).json({
      status: "success",
      data_length: userProperties.length,
      data: userProperties
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};

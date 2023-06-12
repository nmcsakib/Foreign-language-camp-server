// Importing the usersCollection from the "../models/collections" module
const { usersCollection } = require("../models/collections");

// Function to get instructors, with an optional limit parameter
const getInstructors = async (req, res) => {
  const limit = req.params.limit;

  if (limit === 'six') {
    const result = await usersCollection.find({ role: "instructor" }).limit(6).toArray();
    res.send(result);
  } else {
    const result = await usersCollection.find({ role: "instructor" }).toArray();
    res.send(result);
  }
}

module.exports = {
  getInstructors
};

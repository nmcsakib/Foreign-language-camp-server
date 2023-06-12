// Importing the selectedClassCollection from the "../models/collections" module
const { selectedClassCollection } = require("../models/collections");

// Importing the ObjectId from the 'mongodb' module
const { ObjectId } = require('mongodb');

// Function to get selected classes for a specific user
const getSelectedClass = async (req, res) => {
  const result = await selectedClassCollection.find({ email: req.params.email }).toArray();
  res.send(result);
}

// Function to set a selected class for a user
const setSelectedClass = async (req, res) => {
  const classDetails = req.body;
  
  // Checking if the class has already been selected by the user
  const alreadySelected = await selectedClassCollection.findOne({ title: classDetails.title, email: classDetails.email });
  
  if (classDetails.title === alreadySelected?.title) {
    res.status(400).send({ message: "already selected" });
    return;
  } else {
    const result = await selectedClassCollection.insertOne(classDetails);
    res.send(result);
  }
}

// Function to remove a selected class
const removeSelectedClass = async (req, res) => {
  // Setting CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  const id = req.params.id;
  
  const result = await selectedClassCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
}

module.exports = {
  getSelectedClass,
  setSelectedClass,
  removeSelectedClass
};

// Importing the classCollection from the "../models/collections" module
const { classCollection } = require("../models/collections");

// Importing the ObjectId from the 'mongodb' package
const { ObjectId } = require('mongodb');

// Function to get all classes
const getClasses = async (req, res) => {
  const result = await classCollection.find().toArray();
  res.send(result);
}

// Function to get classes taught by a specific instructor
const getInstructorsClass = async (req, res) => {
  const result = await classCollection.find({ instructorEmail: req.params.email }).sort({ date: -1 }).toArray();
  res.send(result);
}

// Function to get approved classes, with an optional limit parameter
const getApprovedClasses = async (req, res) => {
  const limit = req.params.limit;

  if (limit === 'six') {
    const result = await classCollection.find({ status: 'approved' }).limit(6).sort({ totalStudents: -1 }).toArray();
    res.send(result);
  } else {
    const result = await classCollection.find({ status: 'approved' }).toArray();
    res.send(result);
  }
}

// Function to create a new class
const postClass = async (req, res) => {
  const date = new Date();
  const newClass = req.body;
  const totalStudent = 0;
  const result = await classCollection.insertOne({ ...newClass, totalStudent, date });
  res.send(result);
}

// Function to update the status and feedback of a class
const patchStatus = async (req, res) => {
  const id = req.params.id;
  const makeStatus = req.body.status;
  const feedback = req.body.feedback;
  
  const filter = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: {
      status: makeStatus,
      feedback: feedback
    },
  };

  const result = await classCollection.updateOne(filter, updateDoc);
  res.send(result);
}

// Function to update the seat and totalStudents count of a class
const updateSeatAndStudents = async (req, res) => {
  const id = req.params.id;
  const result = classCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $inc: { seat: -1, totalStudents: 1 } },
    { returnOriginal: false }
  );
  res.send(result);
}

module.exports = {
  getClasses,
  getApprovedClasses,
  postClass,
  patchStatus,
  getInstructorsClass,
  updateSeatAndStudents
};

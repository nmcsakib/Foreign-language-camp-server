const express = require('express');

const verifyJWT = require('../middleware/verifyJWT');
const verifyAdmin = require('../middleware/verifyAdmin');
const verifyInstructor = require('../middleware/verifyInstructor');

const {
  getClasses,
  patchStatus,
  updateSeatAndStudents,
  postClass,
  getInstructorsClass,
  getApprovedClasses
} = require('../Controller/classController');

const classesRouter = express.Router();

// Route to get all classes
classesRouter.get('/', getClasses);

// Route to get classes of a specific instructor
classesRouter.get('/instructor/:email', verifyJWT, verifyInstructor, getInstructorsClass);

// Route to get approved classes with optional limit
classesRouter.get('/:limit', getApprovedClasses);

// Route to create a new class
classesRouter.post('/', verifyJWT, verifyInstructor, postClass);

// Route to update the status of a class (requires admin access)
classesRouter.patch('/:id', verifyJWT, verifyAdmin, patchStatus);

// Route to update seat count and total students for a class
classesRouter.patch('/seat/:id', verifyJWT, updateSeatAndStudents);

module.exports = classesRouter;

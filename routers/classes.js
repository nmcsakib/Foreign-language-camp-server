const express = require('express');

const verifyJWT = require('../middleware/verifyJWT');
const verifyAdmin = require('../middleware/verifyAdmin');

const verifyInstructor = require('../middleware/verifyInstructor');
const { getClasses, patchStatus, updateSeatAndStudents, postClass, getInstructorsClass, getApprovedClasses } = require('../Controller/classController');
const classesRouter = express.Router()

classesRouter.get('/', getClasses)

classesRouter.get('/instructor/:email', verifyJWT, verifyInstructor, getInstructorsClass)
classesRouter.get('/:limit', getApprovedClasses)

classesRouter.post('/', verifyJWT, verifyInstructor, postClass)

classesRouter.patch('/:id', verifyJWT, verifyAdmin, patchStatus)

classesRouter.patch('/seat/:id', verifyJWT, updateSeatAndStudents)

module.exports = classesRouter
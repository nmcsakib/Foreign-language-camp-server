const express = require('express');

const {getInstructors} = require('../Controller/instructorsController');
const instructorRouter = express.Router()

instructorRouter.get('/:limit', getInstructors)

module.exports = instructorRouter
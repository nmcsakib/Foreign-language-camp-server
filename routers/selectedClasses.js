const express = require('express');

const verifyJWT = require('../middleware/verifyJWT');
const { getSelectedClass, setSelectedClass, removeSelectedClass } = require('../Controller/selectedClassController');

const selectedClassRouter = express.Router()

selectedClassRouter.get('/:email', verifyJWT, getSelectedClass)
selectedClassRouter.delete('/:id', verifyJWT, removeSelectedClass)
selectedClassRouter.post('/',verifyJWT, setSelectedClass)
module.exports = selectedClassRouter
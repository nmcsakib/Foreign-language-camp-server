const express = require('express');

const jwt = require('jsonwebtoken');

const jwtRouter = express.Router()

jwtRouter.post('/', (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
  
    res.send({ token })
  })

  module.exports = jwtRouter
  
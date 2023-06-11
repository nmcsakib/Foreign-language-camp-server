const express = require('express');
const verifyJWT = require('../middleware/verifyJWT');
const verifyAdmin = require('../middleware/verifyAdmin');
const { getUsers, postUser, getUserEmail, addRole } = require('../Controller/userController');

const userRouter = express.Router()

userRouter.get('/', verifyJWT, verifyAdmin, getUsers );

  userRouter.post('/', postUser);

  userRouter.get('/:email', verifyJWT, getUserEmail )

  userRouter.patch('/admin/:id', verifyJWT, verifyAdmin, addRole)
  module.exports = userRouter

const { usersCollection } = require("../models/collections");

const { ObjectId } = require('mongodb')
const getUsers = async (req, res) => {
    const result = await usersCollection.find().toArray();
    res.send(result);
  }
  const postUser =   async (req, res) => {
    const user = req.body;
    
    console.log(user);
    const query = { email: user.email }
    const existingUser = await usersCollection.findOne(query);

    if (existingUser) {
      return res.send({ message: 'user already exists' })
    }

    const result = await usersCollection.insertOne(user);
    res.send(result);
  }

  const getUserEmail = async (req, res) => {
    const email = req.params.email;
  
    if (req.decoded.email !== email) {
      res.status(401).send({ admin: false })
    }
  
    const query = { email: email }
    const user = await usersCollection.findOne(query);
    const result = { role: user.role }
    console.log(result);
    res.send(result);
  }

  const addRole =  async (req, res) => {
    const id = req.params.id;
    const makeRole = req.body.role;
    console.log(req.body, id);
    
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: {
        role: makeRole
      },
    };

    const result = await usersCollection.updateOne(filter, updateDoc);
    res.send(result);

  }
  module.exports = {getUsers, postUser, getUserEmail, addRole}
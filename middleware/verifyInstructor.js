const { usersCollection } = require("../models/collections");

const verifyInstructor = async (req, res, next) => {
    const email = req.decoded.email;
    const query = { email: email }
    const user = await usersCollection.findOne(query);
    if (user?.role !== 'instructor') {
      return res.status(403).send({ error: true, message: 'forbidden message' });
    }
    next();
  }
  module.exports = verifyInstructor
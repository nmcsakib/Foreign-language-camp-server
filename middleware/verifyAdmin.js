// Importing the usersCollection from the "../models/collections" module
const { usersCollection } = require("../models/collections");

// Middleware function to verify if the user is an admin
const verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  const query = { email: email };
  const user = await usersCollection.findOne(query);

  if (user?.role !== 'admin') {
    return res.status(403).send({ error: true, message: 'forbidden message' });
  }

  next();
};

module.exports = verifyAdmin;

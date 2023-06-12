// Importing required dependencies and modules
require('dotenv').config();
const { ObjectId } = require('mongodb');
const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY);
const { paymentCollection, selectedClassCollection } = require("../models/collections");

// Function to create a payment intent for Stripe
const paymentIntent = async (req, res) => {
  // Setting CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  const { price } = req.body;
  const amount = parseInt(price * 100);
  
  // Creating a payment intent with Stripe
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
    payment_method_types: ['card']
  });

  res.send({
    clientSecret: paymentIntent.client_secret
  });
}

// Function to get payment information for a specific user
const getPaymentInfo = async (req, res) => {
  // Setting CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  const email = req.params.email;
  
  // Retrieving payment information for the specified email
  const result = await paymentCollection.find({ email: email }).project({
    _id: 1,
    classTitle: 1,
    classImage: 1,
    price: 1,
    transactionId: 1,
    date: 1
  }).sort({ date: -1 }).toArray();
  
  res.send(result);
}

// Function to set payment information
const setPayment = async (req, res) => {
  // Setting CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  const payment = req.body;
  const date = new Date();
  
  // Inserting the payment information into the paymentCollection
  const insertResult = await paymentCollection.insertOne({ ...payment, date });

  // Deleting the selected class from the selectedClassCollection
  const deleteResult = await selectedClassCollection.deleteOne({ _id: new ObjectId(payment.classId) });
  
  console.log({ insertResult, deleteResult });
  res.send({ insertResult, deleteResult });
}

// Function to retrieve enrolled classes for a specific user
const enrolledClasses = async (req, res) => {
  const email = req.params.email;
  
  // Retrieving enrolled classes for the specified email
  const result = await paymentCollection.find({ email: email }).sort({ date: -1 }).toArray();
  res.send(result);
}

module.exports = {
  paymentIntent,
  setPayment,
  getPaymentInfo,
  enrolledClasses
};


require('dotenv').config()

const { ObjectId } = require('mongodb')
const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY)
const { paymentCollection, selectedClassCollection } = require("../models/collections");


const paymentIntent = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    const { price } = req.body;
    console.log('price', req.body)
    const amount = parseInt(price * 100);
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        payment_method_types: ['card']
    });

    res.send({
        clientSecret: paymentIntent.client_secret
    })
}

const getPaymentInfo = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    const email = req.params.email;
    console.log(email);
    const result = await paymentCollection.find({ email: email }).project({
        _id: 1,
        classTitle: 1,
        classImage: 1,
        price: 1,
        transactionId: 1,
        date: 1
    }).sort({date: -1}).toArray();
    console.log(result);
    res.send(result)
}
const setPayment = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    const payment = req.body;
    const date = new Date()
    console.log(payment);
    const insertResult = await paymentCollection.insertOne({...payment, date});

    const deleteResult = await selectedClassCollection.deleteOne({ _id: new ObjectId(payment.classId) })
    console.log({ insertResult, deleteResult });

    res.send({ insertResult, deleteResult });
}
const enrolledClasses = async (req, res) => {
    const email = req.params.email;
    const result = await paymentCollection.find({ email: email }).sort({date: -1}).toArray();
    res.send(result)
}
module.exports = { paymentIntent, setPayment, getPaymentInfo, enrolledClasses }
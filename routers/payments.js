const express = require('express');
const verifyJWT = require('../middleware/verifyJWT');
const { setPayment, paymentIntent, getPaymentInfo, enrolledClasses } = require('../Controller/paymentController');
const paymentRouter = express.Router()
paymentRouter.get('/my-payments/:email', verifyJWT, getPaymentInfo)
paymentRouter.post('/create-payment-intent', verifyJWT, paymentIntent)
paymentRouter.post('/', verifyJWT, setPayment )
paymentRouter.get('/enrolled-classes/:email', verifyJWT, enrolledClasses)

module.exports = paymentRouter
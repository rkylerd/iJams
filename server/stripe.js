const express = require("express");
const router = express.Router();
let { parsed: { STRIPE_API_KEY = '' } = {}} = require('dotenv').config();
if (!STRIPE_API_KEY) STRIPE_API_KEY = process.env.STRIPE_API_KEY;
const stripe = require("stripe")(STRIPE_API_KEY);

// Stripe accepts amount in the form of cents, not dollars
const calculateOrderAmount = items => 
  100 * (items.reduce((accPrice, {trackPrice = '0'}) => 
    accPrice += parseFloat(trackPrice), 0));
  
router.post("/", async (req, res) => {
  const { items } = req.body || {};
  // Create a PaymentIntent with the order amount and currency
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "usd"
    });
    
    res.send({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(error.statusCode).send({error: error.message}); 
  }
});

module.exports = router;
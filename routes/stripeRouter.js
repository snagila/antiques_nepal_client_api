import express from "express";
import Stripe from "stripe";

export const stripeRouter = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

stripeRouter.post("/create-payment-intent", async (req, res) => {
  try {
    const { total } = req.body;
    // https://docs.stripe.com/testing?testing-method=card-numbers
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "aud",
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.json({
      error: "Something went wrong!!",
    });
  }
});

stripeRouter.get("/payment-intent/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(id);
    res.json({ status: paymentIntent.status });
  } catch (error) {
    res.status(500).json({ error: "Unable to retrieve payment intent" });
  }
});

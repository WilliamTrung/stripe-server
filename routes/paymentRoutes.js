const express = require("express");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51OARbWBE05GWCL9e04OGpsAmaiPaEQr8d5IC8Q4E2d79lkUH3WdCzNx85eBeVUfHhac9PWaXwFSBpK7vxt5f8nxM00zfbq9M1R"
);

// router endpoints
router.post("/create-checkout", async (req, res) => {
  try {
    //prev: domain_name: "http://localhost:4000",
    const paymentMethodDomain = await stripe.paymentMethodDomains.create({
      domain_name: "http://localhost:80",
    });

    const createCustomer = await stripe.customers.create({
      name: req.body.name,
      email: req.body.email,
    });
    // create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      customer: createCustomer.id,
      setup_future_usage: "off_session",
      amount: req.query.amount * 100,
      currency: "usd", // Integer, usd -> pennies, eur -> cents
      automatic_payment_methods: {
        enabled: true,
      },
    });
    // Return the secret
    // paymentIntent.client_secret
    res.json(
      { paymentIntent: paymentIntent }
      // {
      //   customerIntent: createCustomer,
      // }
    );
  } catch (error) {
    switch (error.type) {
      case "StripeCardError":
        console.log(`A payment error occurred: ${error.message}`);
        break;
      case "StripeInvalidRequestError":
        console.log("An invalid request occurred.");
        if (error.param) {
          console.log(`The parameter ${error.param} is invalid or missing.`);
          res.json({ error: `The parameter ${error.param} is invalid or missing.`});
        }
        break;
      default:
        console.log("Another problem occurred, maybe unrelated to Stripe.");
        break;
    }
  }
});

module.exports = router;

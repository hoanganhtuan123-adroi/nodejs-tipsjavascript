"use strict";

const { SuccessResponse } = require("../core/success.response");
const CheckoutService = require("../service/checkout.service");

class CheckoutController {
 checkoutReview = async (req, res, next) => {
    new SuccessResponse({
      message: "Successful checkout",
      metadata: await CheckoutService.checkoutReview({
        ...req.body,
      }),
    }).send(res);   
 }
}

module.exports = new CheckoutController();

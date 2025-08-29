"use strict";

const { SuccessResponse } = require("../core/success.response");
const DiscountService = require("../service/discount.service");

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Successful Code Generations",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCodes = async (req, res, next) => {
    new SuccessResponse({
      message: "Successful code found",
      metadata: await DiscountService.getAllDiscountCodeByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "Successful code found",
      metadata: await DiscountService.getDiscountAmount({ ...req.body }),
    }).send(res);
  };

  getAllDiscountCodesWithProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Successful code found",
      metadata: await DiscountService.getAllDiscountCodeWithProduct({
        ...req.query,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();

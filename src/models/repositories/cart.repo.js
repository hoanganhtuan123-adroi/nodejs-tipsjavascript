"use strict";
const { convertToObjectIdMongoDb } = require("../../utils");
const cartModel = require("../cart.model");
const findCartId = async (cartId) => {
  return await cartModel
    .findOne({ _id: convertToObjectIdMongoDb(cartId), cart_state: "active" })
    .lean();
};

module.exports = {
  findCartId,
};

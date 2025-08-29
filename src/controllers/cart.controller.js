const { SuccessResponse } = require("../core/success.response");
const cartService = require("../service/cart.service");
class CartController {
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new cart success",
      metadata: await cartService.addToCart(req.body),
    }).send(res);
  };

  update = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new cart success",
      metadata: await cartService.addToCartV2(req.body),
    }).send(res);
  };

  delete = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete cart success",
      metadata: await cartService.deleteItemInCart(req.body),
    }).send(res);
  };

  listToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "List cart success",
      metadata: await cartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();

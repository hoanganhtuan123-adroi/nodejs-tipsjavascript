"use strict";
const { findCartId } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("../service/discount.service");
const { BadRequestError } = require("../core/error.response");
const orderModel = require("../models/order.model");
class CheckoutService {
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    const foundCart = await findCartId(cartId);
    if (!foundCart) throw new BadRequestError("Cart not found");

    const checkout_order = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      shop_order_ids_news = [];

    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discount = [],
        item_products = [],
      } = shop_order_ids[i];
      const checkProductServer = await checkProductByServer(item_products);
      if (!checkProductServer[0]) throw new BadRequestError("order wrong!!!");

      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);
      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discount,
        priceRaw: checkoutPrice, // tiền trước giảm giá
        priceApplyDiscount: checkoutPrice, // tiền sau giảm giá
        item_products: checkProductServer,
      };

      if (shop_discount.length > 0) {
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeId: shop_discount[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        });
        // tổng discount giảm giá
        checkout_order.totalCheckout += discount;
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_news.push(itemCheckout);
    }
    return {
      shop_order_ids,
      shop_order_ids_news,
      checkout_order,
    };
  }

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_news, checkout_order } = await this.checkoutReview({
      cartId,
      userId,
      shop_order_ids,
    });

    const products = shop_order_ids_news.flatMap(
      (order) => order.item_products
    );
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const acquireProduct = [];
      const keyLock = await redisService.acquireLock(
        productId,
        quantity,
        cartId
      );
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) await redisService.releaseLock(keyLock);
    }
    if (acquireProduct.includes(false))
      throw new BadRequestError("Order fail, please try again!!!");
    const newOrder = await orderModel.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_news,
    });
    if (newOrder) {
    }
    return newOrder;
  }

  static async getOneOrderByUser() {}

  static async cancelOrderByUser() {}

  static async updateOrderStatusByShop() {}
}

module.exports = new CheckoutService();

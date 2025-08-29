"use strict";
/*
    discount services
    1 - generator discount code [shop | admin]
    2 - get discount amouunt [user]
    3 - get all discount codes [user | shop]
    4 - verify discount code [user]
    5 - delete discount code [admin | shop]
    6 - cancel discount code [user]
*/
const { BadRequestError, NotFoundError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const { convertToObjectIdMongoDb } = require("../utils/index");
const { findAllProduct } = require("../models/repositories/product.repo");
const {
  findAllDiscountCodesUnselect,
  findAllDiscountCodesSelect,
  checkDiscountExists,
} = require("../models/repositories/discount.repo");
class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
      users_used,
    } = payload;
    console.log("Check 1 ");
    // if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
    //   throw new BadRequestError("Discount code has expired");
    // }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("Start date must be before end date");
    }

    const shopObjectId = convertToObjectIdMongoDb(shopId);

    // Kiểm tra mã giảm giá đã tồn tại

    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: shopObjectId,
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount exists");
    }

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_date: start_date,
      discount_end_date: end_date,
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_shopId: shopObjectId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to == "all" ? [] : product_ids,
    });
    return newDiscount;
  }

  static async updateDiscountCode() {}

  static async getAllDiscountCodeWithProduct({ code, shopId, limit, page }) {
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongoDb(shopId),
      })
      .lean();
    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("discount not exists");
    }
    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === "all") {
      products = await findAllProduct({
        filter: {
          product_shop: convertToObjectIdMongoDb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    if (discount_applies_to === "specific") {
      products = await findAllProduct({
        filter: {
          _id: { $in: discount_product_ids },
          isPublish: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    return products;
  }

  static async getAllDiscountCodeByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesUnselect({
      limit: +limit,
      page: +page,
      filter: { discount_shopId: shopId, discount_is_active: true },
      unSeleect: ["__v", "discount_shopId"],
      model: discountModel,
    });

    return discounts;
  }

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongoDb(shopId),
      },
    });
    if (!foundDiscount) throw new NotFoundError("discount doesn't exists");
    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_users_used,
      discount_type,
      discount_value,
    } = foundDiscount;
    console.log(foundDiscount)

    if (!discount_is_active) throw new NotFoundError("Discount expired");
    if (!discount_max_uses) throw new NotFoundError("Discount are out");
    // if (
    //   new Date() < new Date(discount_start_date) ||
    //   new Date() > new Date(discount_end_date)
    // ) {
    //   throw new NotFoundError("discount ecode has expired");
    // }
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, pro) => {
        return acc + pro.quantity * pro.price;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError("Discount requires a minium order value");
      }
    }
    if (discount_max_uses_per_user > 0) {
      const userUserDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (userUserDiscount) {
        throw new BadRequestError("User already used this discount");
      }
    }
    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongoDb(shopId),
    });
    return deleted;
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongoDb(shopId),
      },
    });
    if (!foundDiscount) throw new NotFoundError("discount doesn't exist");
    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });

    return result;
  }
}

module.exports = DiscountService;

"use strict";
const { BadRequestError } = require("../core/error.response");
const inventoryModel = require("../models/inventory.model");
const { getProductById } = require("../models/repositories/product.repo");

class InventoryService {
  static async addStockInventory({
    stock,
    productId,
    shopId,
    location = "123, Tran Phu, HCM",
  }) {
    const product = await getProductById(productId);
    if (!product) throw new BadRequestError("Product not found");
    const query = { inven_shopId: shopId, inven_productId: productId },
      updateSet = {
        $inc: { inven_stock: stock },
        $set: { inven_location: location },
      },
      options = { upsert: true, new: true };
    return await inventoryModel.findOneAndUpdate(query, updateSet, options);
  }
}

module.exports = new InventoryService();

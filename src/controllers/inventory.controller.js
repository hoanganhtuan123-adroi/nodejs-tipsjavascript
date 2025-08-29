"use strict";

const { SuccessResponse } = require("../core/success.response");
const InventoryService = require("../service/inventory.service");

class InventoryController {
  addStock = async (req, res, next) => {
    new SuccessResponse({
      message: "Successful stock addition",
      metadata: await InventoryService.addStockInventory(req.body),
    }).send(res);
  };
}

module.exports = new InventoryController();

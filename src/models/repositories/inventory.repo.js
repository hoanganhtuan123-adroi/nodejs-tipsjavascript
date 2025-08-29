const { convertToObjectIdMongoDb } = require("../../utils");
const inventoryModel = require("../inventory.model");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unKnown",
}) => {
  return await inventoryModel.create({
    inven_shopId: shopId,
    inven_location: location,
    inven_productId: productId,
    inven_stock: stock,
  });
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      inven_productId: convertToObjectIdMongoDb(productId),
      inven_stock: { $gte: quantity },
    },
    updateSet = {
      $inc: {
        inven_stock: -quantity,
      },
      $push: {
        inven_reservation: {
          quantity,
          cartId,
          createOn: new Date(),
        },
      },
    },
    options = { upsert: true, new: true };

  return await inventoryModel.findOneAndUpdate(query, updateSet, options);
};

module.exports = {
  insertInventory,reservationInventory
};

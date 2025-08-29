"use strict";

const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

const discountSchema = new Schema(
  {
    discount_name: { type: String, require: true },
    discount_description: { type: String, require: true },
    discount_type: { type: String, default: "fix-amount" }, // percentage
    discount_value: { type: Number, require: true },
    discount_code: { type: String, requrie: true },
    discount_start_date: { type: Date, require: true },
    discount_end_date: { type: Date, require: true },
    discount_max_uses: { type: Number, require: true }, // số lượng discount
    discount_uses_count: { type: Number, require: true }, // số discount đã sử dụng
    discount_users_used: { type: Array, require: true, default: [] }, // ai đã sử dụng
    discount_max_uses_per_user: { type: Number, require: true },
    discount_min_order_value: { type: Number, require: true },
    discount_max_value: {type:Number, require:true},
    discount_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: {
      type: String,
      require: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: { type: Array, default: [] }, // số sản phẩm được áp dụng
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, discountSchema);

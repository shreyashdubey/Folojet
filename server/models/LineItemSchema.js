// lineItem.js
const mongoose = require("mongoose");

const lineItemSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    admin_graphql_api_id: { type: String },
    current_quantity: { type: Number },
    fulfillable_quantity: { type: Number },
    fulfillment_service: { type: String },
    fulfillment_status: { type: String },
    gift_card: { type: Boolean },
    grams: { type: Number },
    name: { type: String },
    price: { type: String },
    price_set: {
      shop_money: {
        amount: { type: String },
        currency_code: { type: String },
      },
      presentment_money: {
        amount: { type: String },
        currency_code: { type: String },
      },
    },
    product_exists: { type: Boolean },
    product_id: { type: Number },
    quantity: { type: Number },
    requires_shipping: { type: Boolean },
    sku: { type: String },
    taxable: { type: Boolean },
    title: { type: String },
    total_discount: { type: String },
    total_discount_set: {
      shop_money: {
        amount: { type: String },
        currency_code: { type: String },
      },
      presentment_money: {
        amount: { type: String },
        currency_code: { type: String },
      },
    },
    variant_id: { type: Number, required: true },
    variant_inventory_management: { type: String, required: true },
    variant_title: { type: String },
    vendor: { type: String, required: true },
  },
  { timestamps: true }
);

const LineItem = mongoose.model("LineItem", lineItemSchema);

module.exports = LineItem;

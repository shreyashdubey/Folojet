// fulfillment.js
const mongoose = require("mongoose");

const lineItemSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    admin_graphql_api_id: { type: String, required: true },
    attributed_staffs: { type: [Object], default: [] },
    fulfillable_quantity: { type: Number, required: true },
    fulfillment_service: { type: String, required: true },
    fulfillment_status: { type: String, required: true },
    gift_card: { type: Boolean, required: true },
    grams: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: String, required: true },
    price_set: {
      shop_money: { type: Object, required: true },
      presentment_money: { type: Object, required: true },
    },
    product_exists: { type: Boolean, required: true },
    product_id: { type: Number, required: true },
    properties: { type: [Object], default: [] },
    quantity: { type: Number, required: true },
    requires_shipping: { type: Boolean, required: true },
    sku: { type: String, required: true },
    taxable: { type: Boolean, required: true },
    title: { type: String, required: true },
    total_discount: { type: String, required: true },
    total_discount_set: {
      shop_money: { type: Object, required: true },
      presentment_money: { type: Object, required: true },
    },
    variant_id: { type: Number, required: true },
    variant_inventory_management: { type: String, required: true },
    variant_title: { type: String },
    vendor: { type: String, required: true },
    tax_lines: { type: [Object], default: [] },
    duties: { type: [Object], default: [] },
    discount_allocations: { type: [Object], default: [] },
  },
  { _id: false }
);

const fulfillmentSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    admin_graphql_api_id: { type: String, required: true },
    created_at: { type: Date, required: true },
    location_id: { type: Number, required: true },
    name: { type: String, required: true },
    order_id: { type: Number, required: true },
    origin_address: { type: Object, default: {} },
    receipt: { type: Object, default: {} },
    service: { type: String, required: true },
    shipment_status: { type: String, default: null },
    status: { type: String, required: true },
    tracking_company: { type: String, required: true },
    tracking_number: { type: String, required: true },
    tracking_numbers: { type: [String], default: [] },
    tracking_url: { type: String, required: true },
    tracking_urls: { type: [String], default: [] },
    updated_at: { type: Date, required: true },
    line_items: { type: [lineItemSchema], required: true },
  },
  {
    timestamps: true,
  }
);

const Fulfillment = mongoose.model("Fulfillment", fulfillmentSchema);

module.exports = Fulfillment;

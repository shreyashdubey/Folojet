// fulfillment.js
const mongoose = require("mongoose");

const fulfillmentSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    admin_graphql_api_id: { type: String },
    created_at: { type: Date },
    location_id: { type: Number },
    name: { type: String },
    order_id: { type: Number },
    service: { type: String, required: true },
    shipment_status: { type: String, default: null },
    status: { type: String, required: true },
    tracking_company: { type: String, required: true },
    tracking_number: { type: String, required: true },
    tracking_numbers: { type: [String], default: [] },
    tracking_url: { type: String, required: true },
    tracking_urls: { type: [String], default: [] },
    updated_at: { type: Date, required: true },
    line_items: [{ type: mongoose.Schema.Types.ObjectId, ref: "LineItem" }],
  },
  {
    timestamps: true,
  }
);

const Fulfillment = mongoose.model("Fulfillment", fulfillmentSchema);

module.exports = Fulfillment;

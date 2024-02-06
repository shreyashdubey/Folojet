const mongoose = require("mongoose");
const Fulfillment = require("../models/FulfillmentSchema");
const LineItem = require("../models/LineItemSchema");

const orderSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  admin_graphql_api_id: { type: String, required: true },
  fulfillments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Fulfillment" }],
  line_items: [{ type: mongoose.Schema.Types.ObjectId, ref: "LineItem" }],
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

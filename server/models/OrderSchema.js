const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  admin_graphql_api_id: { type: String },
  myshopify_domain: { type: String },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "CustomerSchema" },
  fulfillments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Fulfillment" }],
  line_items: [{ type: mongoose.Schema.Types.ObjectId, ref: "LineItem" }],
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

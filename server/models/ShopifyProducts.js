const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  tags: { type: [String], default: [] },
  handle: { type: String, required: true },
  isGiftCard: { type: Boolean, required: true },
  productType: { type: String, default: '' },
  totalInventory: { type: Number, default: null },
  vendor: { type: String, required: true },
});

// Define the edge schema
const edgeSchema = new mongoose.Schema({
  node: { type: productSchema, required: true },
});

// Define the products schema
const productsSchema = new mongoose.Schema({
  edges: { type: [edgeSchema], default: [] },
});

// Define the data schema
const dataSchema = new mongoose.Schema({
  products: { type: productsSchema, required: true },
});

// Define the main schema
const mainSchema = new mongoose.Schema({
  data: { type: dataSchema, required: true },
  errors: { type: Array, default: [] },
});

// Create the model
const ShopifyModel = mongoose.model('ShopifyModel', mainSchema);

module.exports = ShopifyModel;

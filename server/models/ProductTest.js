const express = require('express');
const mongoose = require('mongoose');

// Define Product schema
const productSchema = new mongoose.Schema({
  id: String,
  title: String,
  tags: [String],
  handle: String,
  isGiftCard: Boolean,
  productType: String,
  totalInventory: Number,
  vendor: String,
});

// Create Product model
const Product = mongoose.model('Product', productSchema);

// Recommendation route
app.get('/recommend/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;

    // Find the product by ID
    const sourceProduct = await Product.findOne({ id: productId });

    if (!sourceProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Find similar products based on tags
    const similarProducts = await Product.find({
      tags: { $in: sourceProduct.tags },
      id: { $ne: productId }, // Exclude the source product itself
    }).limit(5); // Adjust the limit as needed

    res.json({ sourceProduct, similarProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

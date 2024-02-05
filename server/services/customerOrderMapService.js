const express = require("express");
const axios = require("axios");
const router = express.Router();
const ShopifyShopInfoSchema = require("../models/ShopifyShopInfoSchema");
const PriceRulesSchema = require("../models/PriceRulesSchema");
const { trackShipment, getProductImages } = require("./fedxService");
async function processAllShopifyShops() {
  try {
    console.log("my man");
    const allShopifyShops = await ShopifyShopInfoSchema.find();

    for (const shopInfo of allShopifyShops) {
      await fetchOrders(shopInfo);
    }
  } catch (error) {
    console.error("Error processing Shopify shops:", error.message);
  }
}

async function fetchOrders(shopInfo) {
  try {
    const { myshopify_domain, accessToken } = shopInfo;

    const apiUrl = `https://${myshopify_domain}/admin/api/2023-07/orders.json?status=any`;

    const response = await axios.get(apiUrl, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
      },
    });

    // Handle the response here, you can pass it to another function or process it directly
    handleOrdersResponse(response.data);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
  }
}

function handleOrdersResponse(orders) {
  //console.log("Received orders:", orders);
}

module.exports = { processAllShopifyShops };

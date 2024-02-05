const express = require("express");
const axios = require("axios");
const router = express.Router();
const ShopifyShopInfoSchema = require("../models/ShopifyShopInfoSchema");
const CustomerSchema = require("../models/CustomerSchema");
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

function handleOrdersResponse(response) {
  const { orders } = response;
  for (const order of orders) {
    const { customer } = order;
    const customerInstance = new CustomerSchema(customer);
    console.log(customer.id);
    customerInstance
      .save()
      .then((savedCustomer) => {
        //console.log("Customer saved successfully:", savedCustomer);
      })
      .catch((error) => {
        //console.error("Error saving customer:", error);
      });
  }
}

module.exports = { processAllShopifyShops };

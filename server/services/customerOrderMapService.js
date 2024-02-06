const express = require("express");
const axios = require("axios");
const router = express.Router();
const ShopifyShopInfoSchema = require("../models/ShopifyShopInfoSchema");
const CustomerSchema = require("../models/CustomerSchema");
const PriceRulesSchema = require("../models/PriceRulesSchema");
const Fulfillment = require("../models/FulfillmentSchema");
const LineItem = require("../models/LineItemSchema");
const OrderSchema = require("../models/OrderSchema");
const { trackShipment, getProductImages } = require("./fedxService");
async function processAllShopifyShops() {
  try {
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
    handleOrdersResponse(response.data, myshopify_domain);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
  }
}

function handleOrdersResponse(response, myshopify_domain) {
  const { orders } = response;
  for (const order of orders) {
    const { fulfillments, line_items, customer, id, admin_graphql_api_id } =
      order;
    const fulfillment = new Fulfillment(fulfillments);
    const lineItem = new LineItem(line_items);
    console.log("fulfillment ", fulfillments);
    console.log("line_items ", line_items);
    console.log("--------------------------------------------------");
    // fulfillment
    //   .save()
    //   .then((savedFulfillment) => {
    //     console.log(`Fulfillment saved with ID: ${savedFulfillment._id}`);
    //     orderData.fulfillments.push(savedFulfillment._id);

    //     return lineItem.save();
    //   })
    //   .then((savedLineItem) => {
    //     console.log(`Line Item saved with ID: ${savedLineItem._id}`);
    //     orderData.line_items.push(savedLineItem._id);

    //     // Save the order with references to fulfillments and line items
    //     const order = new OrderSchema(orderData);
    //     return order.save();
    //   })
    //   .then((savedOrder) => {
    //     console.log(`Order saved with ID: ${savedOrder._id}`);
    //   })
    //   .catch((error) => {
    //     console.error("Error saving data to MongoDB:", error);
    //     return;
    //   });

    const customerData = { ...customer, myshopify_domain };
    const customerInstance = new CustomerSchema(customerData);
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

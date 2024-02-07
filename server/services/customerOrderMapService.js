const express = require("express");
const axios = require("axios");
const router = express.Router();
const ShopifyShopInfoSchema = require("../models/ShopifyShopInfoSchema");
const CustomerSchema = require("../models/CustomerSchema");
const Fulfillment = require("../models/FulfillmentSchema");
const LineItem = require("../models/LineItemSchema");
const Order = require("../models/OrderSchema");
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
    await handleOrdersResponse(response.data, myshopify_domain);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
  }
}

async function handleOrdersResponse(response, myshopify_domain) {
  const { orders } = response;
  for (const order of orders) {
    try {
      const { fulfillments, line_items, customer, id, admin_graphql_api_id } =
        order;

      let fulfillmentIdArray = [];
      if (fulfillments && fulfillments.length > 0) {
        const fulfillmentObjects = [];
        for (const fulfillmentData of fulfillments) {
          const lineItemsData = fulfillmentData.line_items || [];
          delete fulfillmentData.line_items;
          const lineItemsIds = await LineItem.insertMany(lineItemsData);
          const lineItemsObjectIdArray = lineItemsIds.map((item) => item._id);

          const fulfillment = await Fulfillment.create({
            ...fulfillmentData,
            line_items: lineItemsObjectIdArray,
          });
          fulfillment.save();
          fulfillmentObjects.push(fulfillment);
        }
        fulfillmentIdArray = fulfillmentObjects.map((item) => item._id);
      }

      let standaloneLineItemsObjectIdArray = [];
      if (line_items && line_items.length > 0) {
        const standaloneLineItemsData = line_items.map((item) => item);
        const standaloneLineItemsIds = await LineItem.insertMany(
          standaloneLineItemsData
        );

        standaloneLineItemsObjectIdArray = standaloneLineItemsIds.map(
          (item) => item._id
        );
      }
      const orderInstance = Order.create({
        id,
        line_items: standaloneLineItemsObjectIdArray,
        fulfillments: fulfillmentIdArray,
        myshopify_domain,
      })
        .then(() => {
          //console.log("Order Saved successfully");
        })
        .catch((error) => {
          //console.log("Some error happened saving orders");
        });
      const customerData = { ...customer, myshopify_domain };
      const customerInstance = new CustomerSchema(customerData);
      customerInstance
        .save()
        .then((savedCustomer) => {
          //console.log("Customer saved successfully");
        })
        .catch((error) => {
          //console.error("Error saving customer");
        });
    } catch (error) {
      console.error(`Error processing order ${order.id}:`, error);
    }
  }
}

module.exports = { processAllShopifyShops };

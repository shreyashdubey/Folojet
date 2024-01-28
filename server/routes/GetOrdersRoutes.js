const express = require("express");
const axios = require("axios");
const router = express.Router();
const ShopifyShopInfoSchema = require("../models/ShopifyShopInfoSchema");
const PriceRulesSchema = require("../models/PriceRulesSchema");

router.post("/getOrders", async (req, res) => {
  try {
    const { myshopify_domain, customerId } = req.body;

    const shopInfo = await ShopifyShopInfoSchema.findOne({ myshopify_domain });
    if (!shopInfo) {
      return res.status(404).json({ error: "Shop not found" });
    }

    const accessToken = shopInfo.accessToken;

    const apiUrl = `https://${myshopify_domain}/admin/api/2024-01/customers/${customerId}/orders.json`;
    const response = await axios.get(apiUrl, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
      },
      params: {
        status: "any",
      },
    });

    // Extract desired data format
    const extractedData = response.data.orders.map((order) => {
      const { id, fulfillments } = order;

      if (fulfillments && fulfillments.length > 0) {
        // Extract tracking numbers and line items from fulfillments
        const tracking_numbers = fulfillments.reduce((acc, fulfillment) => {
          if (
            fulfillment.tracking_numbers &&
            fulfillment.tracking_numbers.length > 0
          ) {
            acc.push(...fulfillment.tracking_numbers);
          }
          return acc;
        }, []);

        const line_items = fulfillments.reduce((acc, fulfillment) => {
          if (fulfillment.line_items && fulfillment.line_items.length > 0) {
            acc.push(...fulfillment.line_items);
          }
          return acc;
        }, []);

        return { id, tracking_numbers, line_items };
      } else {
        // If no fulfillments, return empty arrays
        return { id, tracking_numbers: [], line_items: [] };
      }
    });
    res.json(extractedData);
    //res.json(response.data);
  } catch (error) {
    console.error("Error in getOrders route:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

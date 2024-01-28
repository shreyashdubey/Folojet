const express = require("express");
const axios = require("axios");
const router = express.Router();
const ShopifyShopInfoSchema = require("../models/ShopifyShopInfoSchema");
const PriceRulesSchema = require("../models/PriceRulesSchema");
const { trackShipment, getProductImages } = require("../services/fedxService");
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

    const orders = response.data.orders;

    const ordersWithTracking = [];
    for (const order of orders) {
      const hasFulfillments =
        Array.isArray(order.fulfillments) && order.fulfillments.length > 0;
      const hasTrackingNumbers =
        hasFulfillments &&
        Array.isArray(order.fulfillments[0].tracking_numbers) &&
        order.fulfillments[0].tracking_numbers.length > 0;
      const orderId = order.id;
      const trackingNumbers = hasTrackingNumbers
        ? order.fulfillments[0].tracking_numbers
        : [];
      if (hasTrackingNumbers) {
        const lineItems = order.line_items || [];
        const productIds = lineItems.map((item) => item.product_id);
        const productImagesArray = [];
        for (const productId of productIds) {
          try {
            const productImagesResponse = await getProductImages(
              myshopify_domain,
              productId,
              accessToken
            );
            productImagesArray.push({ [productId]: productImagesResponse });
          } catch (error) {
            console.error(
              `Error while getting product images for product_id ${productId}:`,
              error.message
            );
          }
        }
        const fedexResponse = hasTrackingNumbers
          ? await trackShipment(trackingNumbers)
          : "";
        ordersWithTracking.push({
          orderId,
          trackingNumbers,
          lineItems,
          fedexResponse,
          productImages: productImagesArray,
        });
      }
    }

    res.json(ordersWithTracking);
  } catch (error) {
    console.error("Error in getOrders route:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

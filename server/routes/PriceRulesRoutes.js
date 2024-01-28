const express = require("express");
const axios = require("axios");
const router = express.Router();
const ShopifyShopInfoSchema = require("../models/ShopifyShopInfoSchema");
const PriceRulesSchema = require("../models/PriceRulesSchema");

router.post("/getPriceRules", async (req, res) => {
  try {
    const { myshopify_domain } = req.body;
    const shopInfo = await ShopifyShopInfoSchema.findOne({ myshopify_domain });
    if (!shopInfo) {
      return res.status(404).json({ error: "Shop not found" });
    }

    const accessToken = shopInfo.accessToken;

    const apiUrl = `https://${myshopify_domain}/admin/api/2024-01/price_rules.json`;
    const response = await axios.get(apiUrl, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error in getPriceRules route:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

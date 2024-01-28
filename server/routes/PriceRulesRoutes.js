const express = require("express");
const axios = require("axios");
const router = express.Router();
const ShopifyShopInfoSchema = require("../models/ShopifyShopInfoSchema");
const PriceRulesSchema = require("../models/PriceRulesSchema");
function transformPriceRules(jsonResponse) {
  return jsonResponse.price_rules
    .filter(
      (priceRule) =>
        priceRule.starts_at &&
        (!priceRule.ends_at || new Date() <= new Date(priceRule.ends_at))
    )
    .map((priceRule) => {
      let subtitle = "";
      let status = "";

      if (priceRule.value_type === "percentage") {
        subtitle = `${Math.abs(parseFloat(priceRule.value))}% off`;
      }

      if (priceRule.prerequisite_to_entitlement_quantity_ratio) {
        const { prerequisite_quantity, entitled_quantity } =
          priceRule.prerequisite_to_entitlement_quantity_ratio;
        if (prerequisite_quantity !== null && entitled_quantity !== null) {
          subtitle += ` • Buy ${prerequisite_quantity} item${
            prerequisite_quantity > 1 ? "s" : ""
          }, get ${entitled_quantity} item${
            entitled_quantity > 1 ? "s" : ""
          } at ${Math.abs(parseFloat(priceRule.value))}% off`;
        }
      } else if (
        priceRule.prerequisite_quantity_range &&
        priceRule.prerequisite_quantity_range.greater_than_or_equal_to
      ) {
        subtitle += ` • Minimum quantity of ${priceRule.prerequisite_quantity_range.greater_than_or_equal_to}`;
      }

      if (
        priceRule.entitled_collection_ids &&
        priceRule.entitled_collection_ids.length > 0
      ) {
        subtitle += ` • ${
          priceRule.entitled_collection_ids.length === 1
            ? "One-time"
            : "Multiple"
        } purchase products in collection`;
      }

      if (priceRule.starts_at) {
        const currentDate = new Date();
        const startsAtDate = new Date(priceRule.starts_at);
        const endsAtDate = priceRule.ends_at
          ? new Date(priceRule.ends_at)
          : null;

        if (currentDate < startsAtDate) {
          status = "Scheduled";
        } else if (endsAtDate && currentDate > endsAtDate) {
          status = "Expired";
        } else {
          status = "Active";
        }
      }

      return {
        title: priceRule.title,
        subtitle,
        status,
      };
    })
    .filter((rule) => rule.status !== "Expired");
}
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
    res.json(transformPriceRules(response.data));
  } catch (error) {
    console.error("Error in getPriceRules route:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

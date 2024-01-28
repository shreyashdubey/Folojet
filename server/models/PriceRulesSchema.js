const mongoose = require("mongoose");

const priceRuleSchema = new mongoose.Schema(
  {
    myshopify_domain: String,
    priceRule: {
      id: Number,
      value_type: String,
      value: String,
      customer_selection: String,
      target_type: String,
      target_selection: String,
      allocation_method: String,
      allocation_limit: Number,
      once_per_customer: Boolean,
      usage_limit: Number,
      starts_at: Date,
      ends_at: Date,
      created_at: Date,
      updated_at: Date,
      entitled_product_ids: [Number],
      entitled_variant_ids: [Number],
      entitled_collection_ids: [Number],
      entitled_country_ids: [Number],
      prerequisite_product_ids: [Number],
      prerequisite_variant_ids: [Number],
      prerequisite_collection_ids: [Number],
      customer_segment_prerequisite_ids: [Number],
      prerequisite_customer_ids: [Number],
      prerequisite_subtotal_range: mongoose.Schema.Types.Mixed,
      prerequisite_quantity_range: mongoose.Schema.Types.Mixed,
      prerequisite_shipping_price_range: mongoose.Schema.Types.Mixed,
      prerequisite_to_entitlement_quantity_ratio: {
        prerequisite_quantity: Number,
        entitled_quantity: Number,
      },
      prerequisite_to_entitlement_purchase: {
        prerequisite_amount: Number,
      },
      title: String,
      admin_graphql_api_id: String,
    },
  },
  {
    timestamps: true,
  }
);

const PriceRuleSchema = mongoose.model("PriceRuleSchema", priceRuleSchema);

module.exports = PriceRuleSchema;

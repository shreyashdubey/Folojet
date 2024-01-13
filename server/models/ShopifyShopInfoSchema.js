const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shopifyShopInfoSchema = new Schema({
  shopData: {
    shop: {
      id: Number,
      name: String,
      email: String,
      domain: String,
      province: String,
      country: String,
      address1: String,
      zip: String,
      city: String,
      source: String,
      phone: String,
      latitude: Number,
      longitude: Number,
      primary_locale: String,
      address2: String,
      created_at: Date,
      updated_at: Date,
      country_code: String,
      country_name: String,
      currency: String,
      customer_email: String,
      timezone: String,
      iana_timezone: String,
      shop_owner: String,
      money_format: String,
      money_with_currency_format: String,
      weight_unit: String,
      province_code: String,
      taxes_included: Boolean,
      auto_configure_tax_inclusivity: String,
      tax_shipping: String,
      county_taxes: Boolean,
      plan_display_name: String,
      plan_name: String,
      has_discounts: Boolean,
      has_gift_cards: Boolean,
      myshopify_domain: String,
      google_apps_domain: String,
      google_apps_login_enabled: String,
      money_in_emails_format: String,
      money_with_currency_in_emails_format: String,
      eligible_for_payments: Boolean,
      requires_extra_payments_agreement: Boolean,
      password_enabled: Boolean,
      has_storefront: Boolean,
      finances: Boolean,
      primary_location_id: Number,
      checkout_api_supported: Boolean,
      multi_location_enabled: Boolean,
      setup_required: Boolean,
      pre_launch_enabled: Boolean,
      enabled_presentment_currencies: [String],
      transactional_sms_disabled: Boolean,
      marketing_sms_consent_enabled_at_checkout: Boolean
    }
  },
  accessToken: String,
  storeFrontAccessToken: {
    storefront_access_token: {
      access_token: String,
      access_scope: String,
      created_at: Date,
      id: Number,
      admin_graphql_api_id: String,
      title: String
    }
  },
},
  {
    timestamps: true
  });

const ShopifyShopInfoSchema = mongoose.model('ShopifyShopInfoSchema', shopifyShopInfoSchema);

module.exports = ShopifyShopInfoSchema;

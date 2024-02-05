const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    created_at: Date,
    updated_at: Date,
    state: String,
    note: String,
    verified_email: Boolean,
    multipass_identifier: String,
    tax_exempt: Boolean,
    email_marketing_consent: {
      state: String,
      opt_in_level: String,
      consent_updated_at: Date,
    },
    sms_marketing_consent: {
      state: String,
      opt_in_level: String,
      consent_updated_at: Date,
      consent_collected_from: String,
    },
    tags: String,
    currency: String,
    accepts_marketing: Boolean,
    accepts_marketing_updated_at: Date,
    marketing_opt_in_level: String,
    tax_exemptions: [String],
    admin_graphql_api_id: String,

    // Nested schema for the default address
    default_address: {
      type: new Schema(
        {
          id: Number,
          customer_id: Number,
          company: String,
          province: String,
          country: String,
          province_code: String,
          country_code: String,
          country_name: String,
          default: Boolean,
        },
        { _id: false }
      ),
    },
  },
  {
    timestamps: true,
  }
);
customerSchema.index({ id: 1 }, { unique: true });

const CustomerSchema = mongoose.model("CustomerSchema", customerSchema);

module.exports = CustomerSchema;

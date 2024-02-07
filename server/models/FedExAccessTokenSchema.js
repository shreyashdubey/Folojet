const mongoose = require("mongoose");

const fedExAccessTokenSchema = new mongoose.Schema(
  {
    access_token: String,
    token_type: String,
    expires_in: Number,
    scope: String,
  },
  {
    timestamps: true,
  }
);

const FedExAccessTokenSchema = mongoose.model(
  "FedxAccessTokenSchema",
  fedExAccessTokenSchema
);

module.exports = FedExAccessTokenSchema;

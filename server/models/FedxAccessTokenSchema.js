const mongoose = require('mongoose');

const fedxAccessTokenSchema = new mongoose.Schema({
access_token: String,
token_type: String,
expires_in: Number,
scope: String
},
{
    timestamps: true
});

const FedxAccessTokenSchema = mongoose.model('FedxAccessTokenSchema', fedxAccessTokenSchema);

module.exports = FedxAccessTokenSchema;

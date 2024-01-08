// FedEx API setup
const axios = require('axios');
const qs = require('qs');
const FedxAccessTokenSchema = require('../models/FedxAccessTokenSchema');
const client_id = 'l743140b9e91864aca805e82cab05574ba';
const client_secret = 'e2100d2cc0cc48e695e5003f0be0ebe5';
const fedexApiUrl = 'https://apis-sandbox.fedex.com/oauth/token';

async function getAccessToken() {
    try {
      const existingToken = await FedxAccessTokenSchema.findOne();
  
      if (existingToken && isTokenValid(existingToken)) {
        return existingToken.access_token;
      }
  
      // Request a new access token
      const response = await axios.post(
        fedexApiUrl,
        qs.stringify({
          grant_type: 'client_credentials',
          client_id,
          client_secret,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      if (response.status === 200) {
        const { access_token, token_type, expires_in, scope} = response.data;
  
        // Save the new access token in MongoDB
        await FedxAccessTokenSchema.findOneAndUpdate({}, { access_token, token_type, expires_in, scope }, { upsert: true });
  
        return access_token;
      } else {
        // Handle error response
        console.error(`Failed to retrieve access token. Status code: ${response.status}`);
        console.error(response.data);
        return null;
      }
    } catch (error) {
      console.error('Error while getting access token:', error.message);
      return null;
    }
  }

function isTokenValid(token) {
    // Implement logic to check if the token is still valid
    // You might compare the current time with the last time the token was refreshed
    // This could involve checking the current time against an estimated expiration time
    // or making a separate API call to validate the token with the FedEx API
    return /* Your validation logic */;
}
  
module.exports = { getAccessToken };
// FedEx API setup
const axios = require("axios");
const qs = require("qs");
const FedExAccessTokenSchema = require("../models/FedExAccessTokenSchema");
const client_id = process.env.FEDEX_CLIENT_ID;
const client_secret = process.env.FEDEX_CLIENT_SECRET;
const fedexApiUrl = process.env.FEDEX_API_BASE_URL;
const fedexTrackingApiUrl = process.env.FEDEX_API_TRACKING_URL;
async function trackShipment(trackingNumbers) {
  if (
    !trackingNumbers ||
    !Array.isArray(trackingNumbers) ||
    trackingNumbers.length === 0
  ) {
    throw new Error("Invalid or missing tracking numbers in the request");
  }

  try {
    // Get a fresh access token
    const accessToken = await getAccessToken();

    if (!accessToken) {
      throw new Error("Failed to get access token");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const requestBody = {
      trackingInfo: trackingNumbers.map((trackingNumber) => ({
        trackingNumberInfo: {
          trackingNumber: trackingNumber,
        },
      })),
      includeDetailedScans: true,
    };

    // Make the API request
    const response = await axios.post(fedexTrackingApiUrl, requestBody, {
      headers,
    });

    // Return the response from FedEx API
    return response.data;
  } catch (error) {
    console.error("Error while calling FedEx API:", error.message);
    throw new Error("Failed to call FedEx API");
  }
}

async function getProductImages(myShopifyDomain, productId, accessToken) {
  const apiUrl = `https://${myShopifyDomain}/admin/api/2024-01/products/${productId}/images.json`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while calling Shopify API:", error.message);
    throw new Error("Failed to get product images");
  }
}

async function getAccessToken() {
  try {
    const existingToken = await FedExAccessTokenSchema.findOne();

    if (existingToken && isTokenValid(existingToken)) {
      return existingToken.access_token;
    }

    // Request a new access token
    const response = await axios.post(
      fedexApiUrl,
      qs.stringify({
        grant_type: "client_credentials",
        client_id,
        client_secret,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (response.status === 200) {
      const { access_token, token_type, expires_in, scope } = response.data;

      // Save the new access token in MongoDB
      await FedExAccessTokenSchema.findOneAndUpdate(
        {},
        { access_token, token_type, expires_in, scope },
        { upsert: true }
      );

      return access_token;
    } else {
      // Handle error response
      console.error(
        `Failed to retrieve access token. Status code: ${response.status}`
      );
      console.error(response.data);
      return null;
    }
  } catch (error) {
    console.error("Error while getting access token:", error.message);
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

module.exports = { getAccessToken, trackShipment, getProductImages };

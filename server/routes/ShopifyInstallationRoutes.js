const express = require("express");
const axios = require("axios");
const router = express.Router();
const SHOPIFY_API_KEY = "7f2f7fb0ffd9670eb8e100c22cd8c307";
const SHOPIFY_API_SECRET = "184083bfaee2172141f8ea289cc37967";
const REDIRECT_URI = `https://donq.onrender.com/api/auth/callback`;
const ShopifyShopInfoSchema = require("../models/ShopifyShopInfoSchema");

router.get("/", (req, res) => {
  //console.log(req.url);
  const { shop } = req.query;
  if (!shop) {
    res.redirect(`https://shopify.dev/apps/default-app-home`);
    return;
  }
  const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=unauthenticated_read_product_listings,unauthenticated_read_product_tags,read_gift_cards,read_products,read_product_listings,read_shipping,write_themes,unauthenticated_read_product_inventory&redirect_uri=${REDIRECT_URI}`;
  //console.log("authUrl ", authUrl);
  res.redirect(authUrl);
});

router.get("/callback", async (req, res) => {
  const { code, shop } = req.query;
  //console.log(code, shop);

  try {
    const accessTokenResponse = await axios.post(
      `https://${shop}/admin/oauth/access_token`,
      {
        client_id: SHOPIFY_API_KEY,
        client_secret: SHOPIFY_API_SECRET,
        code,
      }
    );
    const accessToken = accessTokenResponse.data.access_token;
    //console.log("accR ", accessToken);

    const shopInfoResponse = await axios.get(
      `https://${shop}/admin/shop.json`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
        },
      }
    );
    //console.log("shopInfoResponse ", shopInfoResponse.data);

    const storeFrontResponse = await axios.post(
      `https://${shop}/admin/api/2023-04/storefront_access_tokens.json`,
      { storefront_access_token: { title: "Folojet access token" } },
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
        },
      }
    );

    const storeFrontResponseData = storeFrontResponse.data;
    //console.log("storeFrontResponse ", storeFrontResponseData);

    // Upsert the data in MongoDB
    const filter = {
      myshopify_domain: shopInfoResponse.data.shop.myshopify_domain,
    };
    const update = {
      accessToken,
      storeFrontAccessToken: storeFrontResponseData,
      shopData: shopInfoResponse.data,
    };

    const result = await ShopifyShopInfoSchema.findOneAndUpdate(
      filter,
      update,
      {
        upsert: true,
        new: true, // Return the modified document, not the original
      }
    );

    //console.log("Upsert result: ", result);
    const shopInfo = await ShopifyShopInfoSchema.findOne({
      "shopData.shop.domain": shop,
    });
    if (!shopInfo) {
      return res.status(404).json({ shop, error: "Shop not found" });
    }
    const shopName = shopInfo.shopData.shop.name;
    const f = `
    
░██╗░░░░░░░██╗███████╗██╗░░░░░░█████╗░░█████╗░███╗░░░███╗███████╗  ████████╗░█████╗░
░██║░░██╗░░██║██╔════╝██║░░░░░██╔══██╗██╔══██╗████╗░████║██╔════╝  ╚══██╔══╝██╔══██╗
░╚██╗████╗██╔╝█████╗░░██║░░░░░██║░░╚═╝██║░░██║██╔████╔██║█████╗░░  ░░░██║░░░██║░░██║
░░████╔═████║░██╔══╝░░██║░░░░░██║░░██╗██║░░██║██║╚██╔╝██║██╔══╝░░  ░░░██║░░░██║░░██║
░░╚██╔╝░╚██╔╝░███████╗███████╗╚█████╔╝╚█████╔╝██║░╚═╝░██║███████╗  ░░░██║░░░╚█████╔╝
░░░╚═╝░░░╚═╝░░╚══════╝╚══════╝░╚════╝░░╚════╝░╚═╝░░░░░╚═╝╚══════╝  ░░░╚═╝░░░░╚════╝░

███████╗░█████╗░██╗░░░░░░█████╗░░░░░░██╗███████╗████████╗██╗██╗
██╔════╝██╔══██╗██║░░░░░██╔══██╗░░░░░██║██╔════╝╚══██╔══╝██║██║
█████╗░░██║░░██║██║░░░░░██║░░██║░░░░░██║█████╗░░░░░██║░░░██║██║
██╔══╝░░██║░░██║██║░░░░░██║░░██║██╗░░██║██╔══╝░░░░░██║░░░╚═╝╚═╝
██║░░░░░╚█████╔╝███████╗╚█████╔╝╚█████╔╝███████╗░░░██║░░░██╗██╗
╚═╝░░░░░░╚════╝░╚══════╝░╚════╝░░╚════╝░╚══════╝░░░╚═╝░░░╚═╝╚═╝
`;

    const formattedF = `${f}`;
    return res.status(404).send(`${formattedF}`);
    console.log(
      `https://admin.shopify.com/store/${shopName}/settings/apps?tab=installed`
    );
    res.redirect(
      `https://admin.shopify.com/store/${shopName}/settings/apps?tab=installed`
    );
  } catch (error) {
    console.error(
      "Error during OAuth callback:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

const express = require('express');
const axios = require('axios');
const router = express.Router();
const SHOPIFY_API_KEY = "7f2f7fb0ffd9670eb8e100c22cd8c307";
const SHOPIFY_API_SECRET = "184083bfaee2172141f8ea289cc37967";
const REDIRECT_URI = `https://donq.onrender.com/auth/callback`;
const ShopifyShopInfoSchema = require('../models/ShopifyShopInfoSchema');
router.get("/", (req, res) => {
    console.log(req.url);
    const { shop } = req.query;
    if(!shop){
        res.redirect(`https://shopify.dev/apps/default-app-home`);
        return;
    }
    const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=unauthenticated_read_product_listings,unauthenticated_read_product_tags,read_gift_cards,read_products,read_product_listings,read_shipping,write_themes&redirect_uri=${REDIRECT_URI}`;
    console.log('authUrl ',authUrl)
    res.redirect(authUrl);
});


router.get("/auth/callback", async (req, res) => {
    const { code, shop } = req.query;
    console.log(code,shop)
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
        console.log('accR ',accessToken)

        // Step 3: Use the access token to make authenticated requests to the Shopify API
        const shopInfoResponse = await axios.get(
            `https://${shop}/admin/shop.json`,
            {
                headers: {
                    "X-Shopify-Access-Token": accessToken,
                },
            }
        );
        const storeFrontResponse = await axios.post(`https://${shop}/admin/api/2023-04/storefront_access_tokens.json`,
        {
            headers:{
                "X-Shopify-Access-Token": accessToken,
            } 
        })
        const shopInfo = new ShopifyShopInfoSchema({
            accessToken,
            storeFrontAccessToken: storeFrontResponse,
            shopDate: shopInfoResponse
        });
        await shopInfo.save();
        console.log("accessToken======= ",accessToken)
        console.log("storeFrontResponse=========== ",storeFrontResponse)
        console.log("shopInfoResponse============= ",shopInfoResponse)
        res.redirect(`https://${shop}/admin/apps`);

    } catch (error) {
        // console.error(
        //     "Error during OAuth callback:",
        //     error.response ? error.response.data : error.message
        // );
        // console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
const express = require('express');
const axios = require('axios');
const router = express.Router();
const ShopifyShopInfoSchema = require('../models/ShopifyShopInfoSchema');

router.get('/fetchAllProducts', async(req, res, next) => {
    try{
        const targetShopDomain = 'folojet-dev-store.myshopify.com';
       const response =  await ShopifyShopInfoSchema.findOne({ 'shopData.shop.myshopify_domain': targetShopDomain });
       const storeFrontAccessToken = response.storeFrontAccessToken.storefront_access_token.access_token;
       console.log(storeFrontAccessToken)
       const query = {
        "query": `{
          products(first: 250) {
            edges {
              node {
                id
                title
                tags
                handle
                isGiftCard
                productType
                totalInventory
                vendor
                
              }
            }
          }}
        `
      }
        const allProducts = await axios.post(
            `https://${targetShopDomain}/api/2024-01/graphql.json`,
            query,
            {
                headers: {
                    'X-Shopify-Storefront-Access-Token': storeFrontAccessToken
                }
            }

        )
        // console.log(JSON.stringify(allProducts.data));
        res.send(allProducts.data)
    }catch(e){
        // console.log(e);
    }
});

module.exports = router;
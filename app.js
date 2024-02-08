const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./db");
const app = express();
const userRoutes = require("./server/routes/UserRoutes");
const fedExRoutes = require("./server/routes/FedExRoutes");
const shopifyRoutes = require("./server/routes/ShopifyInstallationRoutes");
const shopifyProducts = require("./server/routes/ShopifyProductsRoutes");
const priceRulesRoutes = require("./server/routes/PriceRulesRoutes");
const getOrdersRoutes = require("./server/routes/GetOrdersRoutes");
const {
  processAllShopifyShops,
} = require("./server/services/customerOrderMapService");
app.use(cors());

app.use((req, res, next) => {
  // <- Serves req time and cookies
  //console.log(req.url);
  req.requestTime = new Date().toISOString();
  if (req.cookies) console.log(req.cookies);
  next();
});

app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

app.use(express.json({ limit: "100mb" })); // <- Parses Json data
app.use(express.urlencoded({ extended: true, limit: "100mb" })); // <- Parses URLencoded data

app.use(bodyParser.json());
app.use(cookieParser());

connectDB();
processAllShopifyShops(); // Do this in cron job
app.use("/api/auth", shopifyRoutes);
app.use("/api/products", shopifyProducts);
app.use("/api/users", userRoutes);
app.use("/api/fedx", fedExRoutes);
app.use("/api/priceRules", priceRulesRoutes);
app.use("/api/shopify-orders", getOrdersRoutes);
console.log("App Started");

module.exports = app;

const path = require('path');
const cors = require('cors');
const cookieParser = require("cookie-parser")
require('dotenv').config();
const AppError = require('./utils/appError');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const app = express();
const server = http.createServer(app);
const validateToken = require('./utils/validateToken');
const userRoutes = require('./server/routes/UserRoutes')
const fedxRoutes = require('./server/routes/FedxRoutes')
const shopifyRoutes = require('./server/routes/ShopifyInstallationRoutes')
app.use(cors());

app.use((req, res, next) => {	// <- Serves req time and cookies
	
	req.requestTime = new Date().toISOString();
	if (req.cookies) console.log(req.cookies);
	next();
});

app.use((req, res, next) => {
	res.setHeader('Content-Type', 'application/json');
	next();
});

app.use(express.json({ limit: '100mb' })); // <- Parses Json data
app.use(express.urlencoded({ extended: true, limit: '100mb' })); // <- Parses URLencoded data

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/client/public/upload', express.static('/client/public/upload'));
  
connectDB();

//app.use(validateToken)
app.use(shopifyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/fedx', fedxRoutes);
console.log("App Started")

module.exports = app;

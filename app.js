const path = require('path');
const cors = require('cors');
const cookieParser = require("cookie-parser")
require('dotenv').config();
const authRouter = require('./routes/authRouter');
const router = require('./routes/routes');
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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
  
  
  // Connect to MongoDB
  connectDB();
  
  app.use(validateToken)
  app.use('/api/users', userRoutes);
  // API Routes

  app.use('/api/v1/auth/', authRouter); 
  console.log("App Started")
  app.use('/api/v1/', router); // <- Calling the router


app.use(errorController); // <- Error Handling Middleware

module.exports = app;

const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { promisify } = require('util');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('../models/UserSchema');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TIMEOUT,
    });
};
// Create and send Cookie ->
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.id);
    user.password = undefined;

    res.cookie("token", token, {
        credentials: 'include',
       httpOnly: false,
    })

    res.status(statusCode).json({
        message: 'success',
        token,
        data: {
            user,
        },
    });
};

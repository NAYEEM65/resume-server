const { User } = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.isAuthenticatedUser = async (req, res, next) => {
    const { token } = req.cookies;

    if (token === null) {
        return res.status(401).send('Unauthorized request');
    }

    if (token) {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData._id);

        next();
    } else {
        return res.status(401).json({
            success: false,
            message: 'Please Login to access this resource',
        });
    }
};

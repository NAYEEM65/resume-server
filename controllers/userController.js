const { User } = require('../models/userModel');
const jwt = require('jsonwebtoken'); // to generate signed token
var { expressjwt } = require('express-jwt'); // for authorization check

const loginUser = async (req, res) => {
    // find the user based on email
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return res.status(400).json({
            error: 'User with that email does not exist. Please signup',
        });
    }
    if (!email || !password) {
        return res.status(400).json({ message: 'please enter email and password' });
    }
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    // persist the token as 't' in cookie with expiry date
    res.cookie('token', token, { expire: new Date() + 9999 });
    return res.json({ token, user });
};

const registerUser = async (req, res) => {
    // Check if this user already exisits
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('That user already exisits!');
    } else {
        // Insert the new user if they do not exist yet
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });
        await user.save((err, user) => {
            if (err) {
                return res.status(400).json({
                    // error: errorHandler(err)
                    error: err.message,
                });
            }
            // user.salt = undefined;
            user.password = undefined;

            res.json({
                user,
            });
        });
    }
};
// exports.signout = (req, res) => {
//     res.clearCookie('t');
//     res.json({ message: 'Signout success' });
// };
const logOut = (req, res, next) => {
    res.cookie('token', '', {
        expiresIn: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
};
const getUserDetails = async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
};

(exports.requireSignin = expressjwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] })),
    (exports.isAuth = (req, res, next) => {
        let user = req.profile && req.auth && req.profile._id == req.auth._id;
        if (!user) {
            return res.status(403).json({
                error: 'Access denied',
            });
        }
        next();
    });

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 'user') {
        return res.status(403).json({
            error: 'Admin resourse! Access denied',
        });
    }
    next();
};

module.exports = { loginUser, registerUser, logOut, getUserDetails };

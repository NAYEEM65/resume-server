const express = require('express');
const {
    loginUser,
    registerUser,
    logOut,
    getUserDetails,
} = require('../controllers/userController');
const { isAuthenticatedUser, verifyToken } = require('../helpers/auth');
const { userSignupValidator } = require('../validators');

const router = express.Router();

router.route('/login').post(loginUser);
router.route('/logout').get(logOut);
router.route('/register').post(userSignupValidator, registerUser);
router.route('/user-details').get(verifyToken, getUserDetails);

module.exports = router;

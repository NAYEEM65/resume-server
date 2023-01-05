const express = require('express');
const {
    loginUser,
    registerUser,
    logOut,
    getUserDetails,
    updateProfile,
} = require('../controllers/userController');
const { isAuthenticatedUser } = require('../helpers/auth');
const { userSignupValidator } = require('../validators');

const router = express.Router();

router.route('/login').post(loginUser);
router.route('/logout').get(logOut);
router.route('/register').post(userSignupValidator, registerUser);
router.route('/user-details').get(isAuthenticatedUser, getUserDetails);
router.route('/update-profile').post(isAuthenticatedUser, updateProfile);

module.exports = router;

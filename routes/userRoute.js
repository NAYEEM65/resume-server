const express = require('express');
const { loginUser, registerUser } = require('../controllers/userController');

const router = express.Router();

router.route('/login').get(loginUser);
router.post('/register', registerUser);

module.exports = router;

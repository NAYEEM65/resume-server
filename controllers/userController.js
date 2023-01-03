const { User } = require('../models/userModel');

const loginUser = async (req, res) => {
    try {
        const result = await User.findOne({
            email: req.body.email,
            password: req.body.password,
        });
        if (result.length > 0) {
            res.send('Login successful');
        }
    } catch (error) {
        res.status(400).json('Login failed');
    }
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

            res.json({
                user,
            });
        });
    }
};

module.exports = { loginUser, registerUser };

const mongoose = require('mongoose');
const { v1: uuidv1 } = require('uuid');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: 'user',
        },
        salt: {
            type: String,
        },

        email: { type: String, default: '' },
        mobileNumber: { type: String, default: '' },
        portfolio: { type: String, default: '' },
        address: { type: String, default: '' },
        carrierObjective: { type: String, default: '' },
        education: { type: Array, default: [] },
        skills: { type: Array, default: [] },
        experience: { type: Array, default: [] },
        projects: { type: Array, default: [] },
    },
    { timestamps: true },
);
// virtual field
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

//JSON WEB TOKEN
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_SECRET_EXPIRE,
    });
};

//compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model('User', userSchema);
module.exports = { User };

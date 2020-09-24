const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if(validator.isEmail(value)) return true;
            throw new Error('Invalid email');
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 6
    },
    tokens: [{
        token: {
            type: String,
            required: true
        } 
    }]
});

userSchema.pre('save', async function(next) {
    const user = this;
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.methods.generateToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString() }, '@#^$%!@*!#*#!');
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if(!user) {
        throw new Error('Login failed');
    }
    if(await bcrypt.compare(password, user.password)) return user;
    throw new Error('Login failed');
}

userSchema.methods.getPublicInfo = async function () {
    return {
        name: this.name,
        email: this.email
    }
}

const User = mongoose.model('User', userSchema);

module.exports = User;
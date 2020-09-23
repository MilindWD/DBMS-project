const express = require('express');
const User = require('../models/user');

const router = new express.Router();

router.get('/', (req, res) => {
    res.send({
        message: "connected"
    });
});

router.post('/user', async (req, res) => {
    try {
        const user = new User(req.body);
        const token = await user.generateToken();
        await user.save();
        res.status(201).send({
            message: "new user created",
            email: user.email,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            error
        });
    }
});

router.post('/user/login' , async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateToken();
        res.status(200).send({
            name: user.name,
            email: user.email,
            token
        });
    } catch (error) {
        res.status(500).send({
            error
        });
    }
});

module.exports = router;
const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const Donor = require('../models/donor');

const router = new express.Router();

router.get('/', (req, res) => {
    res.send({
        message: "connected"
    });
});

router.post('/user/signup', async (req, res) => {
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
            token
        });
    } catch (error) {
        res.status(500).send({
            error
        });
    }
});

router.get('/user/me', auth, async (req, res) => {
    res.send(await req.user.getPublicInfo());
});

router.post('/user/completed', auth, async (req, res) => {
    const jobId = req.query.id;
    const donor = await Donor.findById(jobId);
    if(donor.length==0) {
        return res.status(404).send({
            error: "no such job"
        });
    }
    donor.completedBy = req.user._id;
    await donor.save();
    req.user.jobs.push({job_id: jobId});
    await req.user.save();
    res.status(400).send({
        success: "Job complete"
    });
});

router.get('/user/completed', auth, async (req, res) => {
    const completed = await Donor.find({completedBy: req.user._id});
    res.send(completed);
});

router.post('/logout', auth, async (req, res) => {
    req.user.tokens = [];
    await req.user.save();
    res.send({
        success : "logged out"
    });
});

module.exports = router;
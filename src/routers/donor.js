const Donor = require('../models/donor');
const express = require('express');

const router = new express.Router();

router.post('/donate', async (req, res) => {
    const donor = new Donor(req.body);
    await donor.save();
    res.status(201).send({
        success: "request recorded"
    });
}); 

router.get('/find/:city', async (req, res) => {
    const city = req.params.city;
    const donors = await Donor.find({'address.city': city});
    if(donors) {
        res.status(200).send(donors);
    } else {
        res.status(404).send();
    }
});

module.exports = router;
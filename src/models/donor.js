const mongoose = require('mongoose');

const donatorSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 10
    },
    address: {
        line1: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zipcode: {
            type: String,
            required: true
        }
    },
    completedBy: {
        type: String
    }
});

const Donor = mongoose.model('Donor', donatorSchema);

module.exports = Donor;
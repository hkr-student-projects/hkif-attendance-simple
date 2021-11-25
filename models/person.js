const { default: strictTransportSecurity } = require('helmet/dist/middlewares/strict-transport-security');
const { Schema, model } = require('mongoose');

const person = new Schema({
    devices: {
        list: [
            {
                type: String,
                required: false 
            }
        ] 
    },
    firstname: {
        type: String,
        required: false
    },
    middlename: {
        type: String,
        required: false
    },
    lastname: {
        type: String,
        required: false
    },
    has_paid: {
        type: Boolean,
        requried: false
    },
    emails: [
        {
            type: String,
            required: false
        }
    ],
    phones: [
        {
            type: String,
            required: false
        }
    ]
}, {
    timestamps: true
});

module.exports = model('Person', person);
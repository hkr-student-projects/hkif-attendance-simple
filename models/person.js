const { default: strictTransportSecurity } = require('helmet/dist/middlewares/strict-transport-security');
const { Schema, model } = require('mongoose');

const person = new Schema({
    device: {
        type: String,
        required: true  
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
    ],
    memberships: [
        {
            period: {
                start: {
                    type: Date,
                    required: false
                },
                end: {
                    type: Date,
                    required: false
                }
            },
            has_paid: {
                type: Boolean,
                required: false
            }
        }
    ],
    attendance: [
        {
            date: {
                type: Date,
                required: false
            }
        }
    ]
}, {
    timestamps: true
});

module.exports = model('Person', person);
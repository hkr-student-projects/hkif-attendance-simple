const { default: strictTransportSecurity } = require('helmet/dist/middlewares/strict-transport-security');
const { Schema, model } = require('mongoose');

const whitelisted = new Schema({
    devices: [
        {
            type: String,
            required: true
        }
    ],
    sports: [
        {
            type: String,
            required: false
        }
    ]
}, {
    timestamps: true
});

module.exports = model('Leader', whitelisted);
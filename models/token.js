const { default: strictTransportSecurity } = require('helmet/dist/middlewares/strict-transport-security');
const { Schema, model } = require('mongoose');

const token = new Schema({
    value: {
        type: String,
        required: true
    },
    sport: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = model('Token', token);
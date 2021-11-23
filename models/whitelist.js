const { default: strictTransportSecurity } = require('helmet/dist/middlewares/strict-transport-security');
const { Schema, model } = require('mongoose');

const whitelisted = new Schema({
    device: {
        type: String,
        required: true
    },
    sports: {
        list: [
            {
                type: String,
                required: false
            }
        ]
    }
}, {
    timestamps: true
});

module.exports = model('Whitelist', whitelisted);
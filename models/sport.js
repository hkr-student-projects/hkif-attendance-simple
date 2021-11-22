const { Schema, model } = require('mongoose');

const sport = new Schema({
    title: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        require: true
    },
    end_date: {
        type: Date,
        require: true
    },
    participants: {
        list: [
            {
                type: String,
                required: false
            }
        ]
    }
}, { timestamps: true });


module.exports = model('Sport', sport);
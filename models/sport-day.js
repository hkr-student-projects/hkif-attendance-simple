const { Schema, model } = require('mongoose');

const sport = new Schema({
    weekday: {
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
    },
    date: {
        type: Date,
        require: true
    },
    participants: {
        list: [
            {
                sport: {
                    type: String,
                    required: false
                },
                visitorId: {
                    type: String,
                    required: false 
                }
            }
        ]
    },
    leaders: {
        list: [
            {
                sport: {
                    type: String,
                    required: false
                },
                visitorId: {
                    type: String,
                    required: false 
                }
            }
        ]
    }
}, { timestamps: true });


module.exports = model('SportDay', sport);
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
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: false
            }
        ]
    }
}, { timestamps: true });

sport.method('toClient', function() {
    const sport = this.toObject();
    
    sport.id = sport._id;
    delete sport._id;

    return sport;
});

module.exports = model('Sport', sport);
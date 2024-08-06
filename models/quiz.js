var mongoose = require('mongoose');
const questionSchema = require('./question').schema;

var quizSchema = mongoose.Schema({
    quizname: {
        type: String,
        required: true
    },
    quizdescription: {
        type: String,
    },
    upload: {
        type: Boolean,
        default: false
    },
    owner: {
        type: String,
    },
    owneremail: {
        type: String,
    },
    quizImage: {
        data: {
            type: Buffer,
            default: null
        },
        contentType: {
            type: String,
            default: null
        }
    },
    questions: [questionSchema],

    schoolYear: {
        type: mongoose.Schema.ObjectId,
        ref: 'schoolYear',
        default: 0
    },
    timeLimit: {
        value: {
            type: String, // ตัวอย่างเช่น '15min', '30min', '1hour'
            required: true
        },
        display: {
            type: String, // ตัวอย่างเช่น '15 นาที', '30 นาที', '1 ชั่วโมง'
            required: true
        }
    },
    attemptLimit: {
        type: Number,
        default: 1,
        min: 1
    },
    deadline: {
        type: Date,
        default: null
    },
    isReleased: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Quiz', quizSchema);

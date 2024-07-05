const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const lessonSchema = new Schema({
    LessonName: {
        type: String,

    },
    file: {
        type: String,
    },
    LayOut1ArrayObject: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Layout1',
        default: 0
    }],
    LayOut2ArrayObject: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Layout2',
        default: 0

    }],
    LayOut3ArrayObject: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Layout3',
        default: 0

    }],
    LayOut4ArrayObject: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Layout4',
        default: 0

    }],
    LayOut5ArrayObject: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Layout5',
        default: 0

    }],
    schoolYear:{
        type: mongoose.Schema.ObjectId,
        ref: 'schoolYear',
        default: 0

    },
    comments: [{
            type: mongoose.Schema.ObjectId,
            ref: 'Comments',
    }]
}, { timestamps: true });

const Lesson = mongoose.model('lessons', lessonSchema)

module.exports = Lesson
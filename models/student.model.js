const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const studentSchema = new Schema(
{
    schoolId:{
        type: 'string',
        unique: true
    },
    yearLevel:{ 
        type: String,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    notification:{
        type: mongoose.Schema.ObjectId,
        ref: 'Notification'
    },
    quizes:{
        type: mongoose.Schema.ObjectId,
        ref: 'Quiz'
    },
    lessonArray:{
        type: mongoose.Schema.ObjectId,
        ref: 'lessons'
    },
    comments:{
        type: mongoose.Schema.ObjectId,
        ref: 'Comment'
    },
    logsFiles:{
        type: mongoose.Schema.ObjectId,
        ref: 'LogsFile'
    },
    schoolYear:{
        type: mongoose.Schema.ObjectId,
        ref: 'schoolYear'
    },
    attempts: [{
        quizId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Quiz' // อ้างอิงไปยัง Quiz model
        },
        attemptCount: {
            type: Number,
            default: 0, // จำนวนครั้งที่เข้าทำ
            min: 0
        },
        score: {
            type: Number,
            default: 0, // คะแนนที่ทำได้ในการพยายามนี้
            min: 0
        },
        date: {
            type: Date,
            default: Date.now // วันที่เข้าทำ
        }
    }]
}, {
    timestamps: true
}
)

const Student = mongoose.model('Student', studentSchema)

module.exports = Student
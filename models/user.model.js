const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

// User schema
const userSchema = new Schema({
    googleId: String,
    email: {
        type: String,
        unique: true,
        required: [true, 'Please provide email']
    },
    fname: {
        type: String,
        default: "default",
    },
    lname: {
        type: String,
        default: "default",
    },
    nickname: {
        type: String,
        default: "-",
    },
    notes: {
        type: String,
        default: "-",
    },
    faculty: {
        type: String,
        default: "default"
    },
    branch: {
        type: String,
        default: "default"
    },
    img: {
        type: String,
        default: 'images/profile_pic.png'
    },
    role: {
        type: String,
        required: true, // Make role required
    },
    teacher: {
        type: mongoose.Schema.ObjectId,
        ref: 'Teacher'
    },
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'Student'
    },
    deleted_at: {
        type: Date,
        default: null,
    },
    submitAssign: [{
        type: mongoose.Schema.ObjectId,
        ref: 'submitAssign'
    }]
}, { timestamps: true });

// Hook หลังจากการบันทึก user
userSchema.post('save', async function(doc) {
    const Student = require('./student'); // Import student model
    const Teacher = require('./teacher'); // Import teacher model

    if (doc.role === 'student') {
        const student = new Student({
            user: doc._id,
            // กำหนดค่าอื่น ๆ ที่ต้องการ
        });
        await student.save();
    } else if (doc.role === 'teacher') {
        const teacher = new Teacher({
            user: doc._id,
            // กำหนดค่าอื่น ๆ ที่ต้องการ
        });
        await teacher.save();
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

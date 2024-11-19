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
    }],
    attempts: [{
        type: mongoose.Schema.ObjectId,
        ref: 'attemptEachQuiz' 
    }],
}, { timestamps: true });


const User = mongoose.model('User', userSchema);

module.exports = User;

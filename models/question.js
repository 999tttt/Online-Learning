// // models/question.js

// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const optionSchema = new Schema({
//     optionText: {
//         type: String,
//         required: true
//     }
// });

// const questionSchema = new Schema({
//     questionText: {
//         type: String,
//         required: true
//     },
//     questionType: {
//         type: String,
//         enum: ['MCQ', 'checkbox', 'Paragraph', 'short_answ'], // ประเภทของคำถามที่เป็นไปได้
//         required: true
//     },
//     options: [optionSchema],
//     answer: {
//         type: Boolean,
//         default: false
//     },
//     answerKey: {
//         type: String,
//         default: ""
//     },
//     points: {
//         type: Number,
//         default: 0
//     },
//     open: {
//         type: Boolean,
//         default: true
//     },
   
// });

// module.exports = mongoose.model('Question', questionSchema);

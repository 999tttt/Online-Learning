//RadioButton
var mongoose = require('mongoose')
var question1Schema = mongoose.Schema({
quizid: {
    type: String,
    required: true
},
questionId: {
    type: String,
    required: true
},
name:{
    type: 'string',
    default: 'question1'
},
questionText:{
    type: String, 
    required: true
},
answer: {
    type: String,
    required: true
},
options:{
    type  :Array,
    default:[]
},
questionImage: {
    data: {
        type: Buffer,
        default: null
    },
    contentType: {
        type: String,
        default: null
    }
}
}, { timestamps: true });
module.exports = mongoose.model('question1',question1Schema)
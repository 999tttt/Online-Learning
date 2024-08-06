var Quiz = require('../models/quiz')
var User = require('../models/user.model')
const Student = require("../models/student.model");
const Teacher = require("../models/teacher.model")
const fs = require('fs');
const path = require('path');
const Question = require("../models/question");
const question1 = require("../models/question1");
const question2 = require("../models/question2");
const question3 = require("../models/question3");
const question4 = require("../models/question4");

const mongoose = require('mongoose');

const multer = require('multer');
const upload = multer();

const Grid = require('gridfs-stream');
const { Readable } = require('stream');

const addQuestion = async function addQuestion() {
    const newQuestion = {
        questionText: 'คำถาม',
        options: [{ optionText: 'ตัวเลือก 1' }],
        questionType: 'MCQ',
        points: 1,
        open: true
    };

    try {
        // ส่งคำถามใหม่ไปยังเซิร์ฟเวอร์
        const response = await axios.post('/api/questions', newQuestion);
        
        // เพิ่มคำถามลงในอาร์เรย์ questions
        questions.push(response.data); // สมมติว่าเซิร์ฟเวอร์ส่งคำถามที่เพิ่มเข้ามา

        updateQuestionCount();
        calculateTotalPoints();
        renderQuestions();
    } catch (error) {
        console.error('Error adding question:', error);
        // แสดงข้อความผิดพลาดหรือจัดการข้อผิดพลาดตามต้องการ
    }
}



const createQuestion_1 = async function (req, res, next) {
    try {
        // ใน express-fileupload, ไฟล์ที่อัปโหลดจะถูกเก็บใน req.files
        const files = req.files;
        // if (!files || !files.Url || !files.Url[0]) {
        //     return res.status(400).send('ไม่พบไฟล์ "Url1" ที่อัปโหลด');
        // }
        const questionCounter = req.body.questionCounter;
        const _id = req.body._id;
        // console.log(_id);

        const uploadedFile = req.files.Url;

        // แน่ใจว่า Layout1 ถูก require และอ้างถึงในโค้ดของคุณ
        const newQuestion1 = await new Question1({
            questionText: req.body.questionText,
            options: req.body.options,
            answer: req.body.answer,
            questionImage: [{
                title: req.body.title,
                Url: {
                    data: uploadedFile.data,
                    contentType: uploadedFile.mimetype,
                },
                ImageDescription: req.body.ImageDescription
            }],
            quizArrayObject: [{
                quizid: _id
            }]
        });

        const savedQuestion1 = await newQuestion1.save();
        const question1_id = savedQuestion1._id;
        // ในส่วนที่ใช้ layoutCounter
        for (let i = 1; i <= questionCounter; i++) {
            const uploadedFile = req.files[`Url${i}`];

            const updatedContentQuestion1 = {
                title: req.body[`title${i}`],
                Url: {
                    data: uploadedFile.data,
                    contentType: uploadedFile.mimetype,
                },
                ImageDescription: req.body[`ImageDescription${i}`]
            };

            await question1.findByIdAndUpdate(
                question1_id,
                { $push: { questionImage: updatedContentQuestion1 } },
                { new: true }
            );
        }

        const getQuestion1_Id = savedQuestion1._id;
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            _id,
            { $push: { question1ArrayObject: getQuestion1_Id } },
            { new: true }
        );

      const quizzes = await Quiz.find().sort({ createdAt: 1 }).exec();
      const quizid = req.query.quizid;
      const quiz = await Quiz.findById(quizid);
      const question1 = quiz.question1ArrayObject;
      const question2 = quiz.question2ArrayObject;
      const question3 = quiz.question3ArrayObject;
      const question4 = quiz.question4ArrayObject;
  
      const foundQuestions = [];
      async function findQuestionsAndStoreData(deleteQuestions, Question) {

      
        if (deleteQuestions.length > 0) {
          for (const questionId of deleteQuestions) {
            const foundQuestion = await Question.findById(questionId);
            if (foundQuestion) {
              foundQuestions.push(foundQuestion);
            }
          }
        }
  
        return foundQuestions;
      }

       
      const foundQuestions1 = await findQuestionsAndStoreData(question1, question1);
      const foundQuestions2 = await findQuestionsAndStoreData(question2, question2);
      const foundQuestions3 = await findQuestionsAndStoreData(question3, question3);
      const foundQuestions4 = await findQuestionsAndStoreData(question4, question4);
  
      foundQuestions.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
  
        if (dateA < dateB) {
          return -1;
        } else if (dateA > dateB) {
          return 1;
        } else {
          return 0;
        }
      });

        // res.json(savedLayout1);
        res.render("nextCreateQuestion", { mytitle: "nextCreateQuestion", quiz, quizzes, foundQuestions });
    } catch (err) {
        console.error(err);
        res.status(500).send("เกิดข้อผิดพลาด");
    }
};


module.exports = {
    addQuestion,
    createQuestion_1,
}

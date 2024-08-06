var Quiz = require('../models/quiz')
const Question = require("../models/question");
var User = require('../models/user.model')
const Student = require("../models/student.model");
const Teacher = require("../models/teacher.model")
const SchoolYear = require("../models/schoolYear");
const fs = require('fs');
const path = require('path');
const question1 = require("../models/question1");
const question2 = require("../models/question2");
const question3 = require("../models/question3");
const question4 = require("../models/question4");
const multer = require('multer');
const upload = multer();
const passport = require('passport');
const mongoose = require('mongoose');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
const Grid = require('gridfs-stream');
const { Readable } = require('stream');


exports.createQuiz = async (req, res, next) => {
  try {
      const userData = await User.findById(req.session.userId);
      const schoolYear = req.body.schoolYear;
      const checkExists = await SchoolYear.findOne({ schoolYear });
      const users = await User.find();
      const whatCome = "มีแบบทดสอบเรื่อง";
      const subject = "แบบทดสอบใหม่จาก Online Dentistry Learning"; 
      const whoemail = req.session.email;
      console.log("Email:", whoemail);
      const name = req.body.quizname;
      const description = req.body.quizdescription;
      const timeLimit = req.body.timeLimit;
      const attemptLimit = req.body.attemptLimit;
      const timeLimitObj = JSON.parse(timeLimit);
      
      let questions = [
        {
            questionText: 'คำถามไม่ระบุชื่อ',
            options: [{ optionText: 'ตัวเลือก 1' }],
            questionType: 'MCQ',
            answer: false,
            answerKey: "",
            points: 1,
            open: true
        }
    ];

      if (checkExists) {
          let quizCreate;

          if (req.file) {
              const file = req.file.path;
              quizCreate = new Quiz({
                  owneremail: whoemail,
                  quizname: name,
                  quizdescription: description,
                  timeLimit: {
                      value: timeLimitObj.value,
                      display: timeLimitObj.display
                  },
                  attemptLimit: attemptLimit,
                  upload: true,
                  quizImage: {
                      data: file, // Assuming the file is an image
                      contentType: req.file.mimetype
                  },
                  schoolYear: checkExists._id,
                  questions: questions // Add questions to the quiz
              });
          } else {
              quizCreate = new Quiz({
                  owneremail: whoemail,
                  quizname: name,
                  quizdescription: description,
                  timeLimit: {
                      value: timeLimitObj.value,
                      display: timeLimitObj.display
                  },
                  attemptLimit: attemptLimit,
                  upload: false,
                  schoolYear: checkExists._id,
                  questions: questions // Add questions to the quiz
              });
          }

          await quizCreate.save();

          // Update SchoolYear with new quiz
          await SchoolYear.findByIdAndUpdate(
              checkExists._id,
              { $push: { quizArray: quizCreate._id } },
              { new: true }
          );

          const schYear = checkExists.schoolYear;
          const quizzes = await Quiz.find().sort({ createdAt: 1 }).populate("schoolYear");
          const quizId = quizCreate._id;
          const quiz = await Quiz.findById(quizId);

          const theme = req.session.theme || 'light'; 
          const isSidebarOpen = false;

          const foundQuestions = quiz.questions;

          await Promise.all(users.map(async user => {
              const findUser = await User.findById(user._id)
                  .populate({
                      path: "student",
                      populate: {
                          path: "schoolYear",
                      }
                  });
              if (findUser.student && (findUser.student.schoolYear.schoolYear == checkExists.schoolYear)) {
                  const email = user.email;
                  sendEmail(email, subject, name, userData, whatCome);
              }
          }));

          createNotification(`${userData._id}`, `${userData.fname} ${userData.lname}`, `${whatCome} "${name}" ถูกเพิ่มใหม่ลงในระบบ`, req, res, next)

          res.render("eachQuiz", { mytitle: "eachQuiz", quiz, quizzes, foundQuestions, schYear, theme, isSidebarOpen });

      } else {
          const createSchoolYear = new SchoolYear({
              schoolYear: schoolYear
          });
          await createSchoolYear.save();

          let quizCreate;

          if (req.file) {
              const file = req.file.path;
              quizCreate = new Quiz({
                  owneremail: whoemail,
                  quizname: name,
                  quizdescription: description,
                  timeLimit: {
                      value: timeLimitObj.value,
                      display: timeLimitObj.display
                  },
                  attemptLimit: attemptLimit,
                  upload: true,
                  quizImage: {
                      data: file,
                      contentType: req.file.mimetype
                  },
                  schoolYear: createSchoolYear._id,
                  questions: questions // Add questions to the quiz
              });
          } else {
              quizCreate = new Quiz({
                  owneremail: whoemail,
                  quizname: name,
                  quizdescription: description,
                  timeLimit: {
                      value: timeLimitObj.value,
                      display: timeLimitObj.display
                  },
                  attemptLimit: attemptLimit,
                  upload: false,
                  schoolYear: createSchoolYear._id,
                  questions: questions // Add questions to the quiz
              });
          }

          await quizCreate.save();

          // Update SchoolYear with new quiz
          await SchoolYear.findByIdAndUpdate(
              createSchoolYear._id,
              { $push: { quizArray: quizCreate._id } },
              { new: true }
          );

          const schYear = createSchoolYear.schoolYear;
          const quizzes = await Quiz.find().sort({ createdAt: 1 }).exec();
          const quizId = quizCreate._id;
          const quiz = await Quiz.findById(quizId);

          const theme = req.session.theme || 'light'; 
          const isSidebarOpen = false;

          const foundQuestions = quiz.questions;

          await Promise.all(users.map(async user => {
              const findUser = await User.findById(user._id)
                  .populate({
                      path: "student",
                      populate: {
                          path: "schoolYear",
                      }
                  });
              if (findUser.student && (findUser.student.schoolYear.schoolYear == checkExists.schoolYear)) {
                  const email = user.email;
                  sendEmail(email, subject, name, userData, whatCome);
              }
          }));

          createNotification(`${userData._id}`, `${userData.fname} ${userData.lname}`, `${whatCome} "${name}" ถูกเพิ่มใหม่ลงในระบบ`, req, res, next)

          res.render("eachQuiz", { mytitle: "eachQuiz", quiz, quizzes, foundQuestions, schYear, theme, isSidebarOpen });
      }

  } catch (err) {
      console.error(err);
      res.status(500).send("เกิดข้อผิดพลาด");
  }
}




exports.getUploadquiz = (req, res) => {
  Quiz.find({ owner: req.userId, upload: false }, (err, qz) => {
    if (err) {
      console.log(error);
      res.json({ msg: "some error!" });
    }
    else {
      res.json({ quiz: qz });
    }
  })
}

exports.seeStudent = (req, res) => {
  User.find({ role: "student" }, (err, usr) => {
    if (err) {
      console.log(error);
      res.json({ msg: "some error!" });
    }
    else {
      res.json({ user: usr });
    }
  })
}

// exports.createQuestion_1 = (req, res) => {

//     Question.find({ quizid: req.body.quizid }, (err, q) => {
//         if (err) {
//             console.log(error);
//             res.json({ msg: "some error!" });
//         }
//         else {
//             var question1 = new question1({
//                 quizid: req.body.quizid,
//                 questionId: q.length + 1,
//                 questionText: req.body.questionText,
//                 questionImage: req.body.questionImage,
//                 answer: req.body.answer,
//                 options: req.body.options
//             });

//             question1.save((error, qsn) => {
//                 if (error) {
//                     console.log(error);
//                     res.json({ msg: "some error!" });
//                 }
//                 else {
//                     res.status(200).json({ message: "yes question added!!" })
//                 }
//             })
//         }
//     })
// }

exports.uploadQuiz = (req, res) => {
  console.log("upload back");
  console.log(req.body);
  Question.find({ quizid: req.body.id }, (err, qz) => {
    if (err) {
      console.log(error);
      res.json({ msg: "some error!" });
    }
    else {
      console.log(qz.length);
      if (qz.length < 5) {
        res.json({ msg: "You must have 5 question in the quiz for upload quiz!!" });
      }
      else {
        Quiz.updateOne({ _id: req.body.id }, { upload: true }, function (err, user) {
          if (err) {
            console.log(err)
            res.json({ msg: "something went wrong!!" })
          }
          else {
            const io = req.app.get('io');
            io.emit("quizcrud", "Quiz Crud done here");
            res.json({ message: "quiz uploaded!" });
          }
        })

      }

    }
  })

}




exports.getHomequiz = (req, res) => {
  Quiz.find({ owner: req.userId, upload: true }, (err, qz) => {
    if (err) {
      console.log(error);
      res.json({ msg: "some error!" });
    }
    else {
      res.json({ quiz: qz });
    }
  })
}

exports.getAllQuestion = (req, res) => {
  // const url = `http://localhost:4200/teacher/seequestion`
  Question.find({ quizid: req.params.id }, (err, qz) => {
    if (err) {
      console.log(error);
      res.json({ errormsg: "some error!" });
    }
    else {
      res.json({ msg: qz });
    }
  })
  res.redirect(
    'adminExam')
}




exports.adminExamsIndex = async (req, res) => {
  try {
    const userData = await User.findById(req.session.userId);
    const quiz = await Quiz.find().sort({ createdAt: 1 }).populate("schoolYear");
    const schoolYears = await SchoolYear.find().sort({ schoolYear: 0 });
    const findYear = null;
    const theme = req.session.theme || 'light'; 
    const isSidebarOpen = false; 
    res.render("adminExam", { mytitle: "adminExam",userData, quiz,schoolYears ,findYear , theme ,isSidebarOpen }); // ถ้าไฟล์อยู่ในโฟลเดอร์ views
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}
// เพิ่มการแสดงหน้าสร้างแบบทดสอบ
exports.addQuizPage = async (req, res) => {
  // if (req.user) {
    try {
      const userData = await User.findById(req.session.userId);
      const schoolYearId = req.query.schoolYearId;
      const schoolYears = await SchoolYear.find().sort({ schoolYear: 0 });
      const theme = req.session.theme || 'light'; 
      const isSidebarOpen = false; 

      const quiz = await Quiz.find().sort({ createdAt: 1 }).exec();
      res.render("addQuiz", { mytitle: "addQuiz", quiz, userData ,schoolYearId,schoolYears , theme, isSidebarOpen}); // เปลี่ยนชื่อหน้าตามที่คุณต้องการ
    } catch (err) {
      console.error(err);
      res.status(500).send("เกิดข้อผิดพลาด");
    }
  }
//   else {
//     res.redirect('/login');
//   }
// }

exports.eachQuiz = async (req, res) => {
  try {
    const userData = await User.findById(req.session.userId);
    const quizzes = await Quiz.find().sort({ createdAt: 1 }).exec();
    let quizid = req.query.quizId;

    // ตรวจสอบว่ามี '/edit' หรือไม่
    const isEditPage = quizid.includes('/edit');
    if (isEditPage) {
      quizid = quizid.split('/edit')[0]; // แยก '/edit' ออก
    }

    const isViewPage = quizid.includes('/preview');
    if (isViewPage) {
      quizid = quizid.split('/preview')[0]; // แยก '/edit' ออก
    }

    const quiz = await Quiz.findById(quizid);

    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }

    const theme = req.session.theme || 'light';
    const isSidebarOpen = false;

    const foundQuestions = quiz.questions;
    async function findQuestionsAndStoreData(deleteQuestions, Question) {
      if (deleteQuestions && deleteQuestions.length > 0) {
        for (const questionId of deleteQuestions) {
          const foundQuestion = await Question.findById(questionId);
          if (foundQuestion) {
            foundQuestions.push(foundQuestion);
          }
        }
      }
      return foundQuestions;
    }

    // สมมติว่า deleteQuestions เป็น array ของ questionId ที่คุณต้องการหา
    const deleteQuestions = quiz.questions.map(q => q._id);

    await findQuestionsAndStoreData(deleteQuestions, Question);

    foundQuestions.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateA - dateB;
    });

    

    // Render หน้าแต่ละหน้า
    if (isEditPage) {
      res.render("editEachQuiz_test", {
        mytitle: "editEachQuiz",
        quiz,
        quizzes,
        foundQuestions,
        userData,
        theme,
        isSidebarOpen
      });
    }else if (isViewPage) {
        res.render("quiz_preview", {
          mytitle: "viewEachQuiz",
          quiz,
          quizzes,
          foundQuestions,
          userData,
          theme,
          isSidebarOpen
        });
    } else {
      res.render("eachQuiz", {
        mytitle: "eachQuiz",
        quiz,
        quizzes,
        foundQuestions,
        userData,
        theme,
        isSidebarOpen
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
};








exports.createQuestion = async function (req, res, next) {
  // if (req.user.role === 'teacher') {
    try {
      if (req.files && req.files.quizImage) {
        const uploadedFile = req.files.quizImage;
        const quiz = new Quiz({
          quizname: req.body.quizname,
          quizImage: {
            data: uploadedFile.data,
            contentType: uploadedFile.mimetype,
          }
        });
        await quiz.save();
        const quiz_id = Quiz._id;
        const quiz_name = Quiz.quizName;
        res.render("adminCreateQuestion", { mytitle: "adminCreateQuestion", quiz, quiz_id, quiz_name, user: req.user });
      } else {
        const quiz = new Quiz({
          QuizName: req.body.quizname,
        });
        await quiz.save();
        const quiz_id = quiz._id;
        const quiz_name = quiz.quizname;
        res.render("adminCreateQuestion", { mytitle: "adminCreateQuestion", quiz, quiz_id, quiz_name, user: req.user });
      }

    } catch (err) {
      console.error(err);
      res.status(500).send("เกิดข้อผิดพลาด");
    }

  }
  // else {
  //   res.redirect('/login');
  // }
// }
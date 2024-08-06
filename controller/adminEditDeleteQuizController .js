const Quiz = require("../models/quiz");
const Question = require("../models/question");
const question1 = require("../models/question1");
const question2 = require("../models/question2");
const question3 = require("../models/question3");
const question4 = require("../models/question4");
const SchoolYear = require("../models/schoolYear");
const User = require("../models/user.model");
const mongoose = require('mongoose');


const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const deleteQuiz = async (req, res) => {
  const getQuiz_id = req.query.quizId;

  try {
      // หา Quiz ที่ต้องการลบ
      const getQuiz = await Quiz.findById(getQuiz_id);

      if (!getQuiz) {
          return res.status(404).send('Quiz not found');
      }

      // หา question IDs ทั้งหมดที่อยู่ใน quiz นี้
      const questionIds = getQuiz.questions.map(question => question._id);

      // ลบ questions ทั้งหมดที่เกี่ยวข้องกับ quiz นี้
      async function deleteQuestions(questionIds) {
          if (questionIds.length > 0) {
              for (const questionId of questionIds) {
                  await Question.findByIdAndDelete(questionId);
              }
          }
      }

      // เรียกใช้ฟังก์ชัน deleteQuestions
      await deleteQuestions(questionIds);

      // ลบ quiz
      await Quiz.findByIdAndDelete(getQuiz_id);

      res.redirect('/adminIndex/adminExamsIndex');
  } catch (error) {
      console.error('Error deleting quiz:', error);
      res.status(500).send('Internal Server Error');
  }
};

const updateQuiz = async (req, res) => {
  try {
      const { quizId, quizname, quizdescription, attemptLimit, timeLimit, schoolYear } = req.body;
      console.log("Request data:",req.body);
      // Ensure that schoolYear is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(schoolYear)) {
          return res.status(400).json({ success: false, message: 'Invalid schoolYear ObjectId' });
      }

      const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, {
          quizname,
          quizdescription,
          attemptLimit,
          timeLimit, // This should be an object
          schoolYear: mongoose.Types.ObjectId(schoolYear)
      }, { new: true });

      if (!updatedQuiz) {
          return res.status(404).json({ success: false, message: 'Quiz not found' });
      }

      res.json({ success: true, quiz: updatedQuiz });
  } catch (error) {
      console.error('Error updating quiz:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
};






const editLesson = async function (req, res, next) {
  if(req.user.role === 'teacher'){
  const lessons = await Lesson.find().sort({ LessonNumber: 1 }).exec();
  const lessonId = req.query.lesson;
  const lesson = await Lesson.findById(lessonId);
  const layout01 = lesson.LayOut1ArrayObject;
  const layout02 = lesson.LayOut2ArrayObject;
  const layout03 = lesson.LayOut3ArrayObject;
  const layout04 = lesson.LayOut4ArrayObject;
  

  const foundLayouts = [];
  async function findLayoutsAndStoreData(deleteLayouts, Layout) {

    if (deleteLayouts.length > 0) {
      for (const layoutId of deleteLayouts) {
        const foundLayout = await Layout.findById(layoutId);
        if (foundLayout) {
          foundLayouts.push(foundLayout);
        }
      }
    }

    return foundLayouts;
  }

  const foundLayouts1 = await findLayoutsAndStoreData(layout01, Layout1);
  const foundLayouts2 = await findLayoutsAndStoreData(layout02, Layout2);
  const foundLayouts3 = await findLayoutsAndStoreData(layout03, Layout3);
  const foundLayouts4 = await findLayoutsAndStoreData(layout04, Layout4);

  foundLayouts.sort((a, b) => {
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


  // res.json(foundLayouts);
  res.render("adminEdit", { mytitle: "adminEdit", lesson, lessons, foundLayouts,user:req.user });

}
else{
  res.redirect('/login');
}
}

const makeEdit = async function (req, res, next) {
  req.user
  try {
    const _id = req.body._id;

    const updatedData = {
      Topic: req.body.Topic,
      MainDescription: req.body.MainDescription,
      SubDescription: req.body.SubDescription,
      AboutImage: [],
    };

    const finalCountImg = req.body.finalCountImg;
    for (let i = 1; i <= finalCountImg.length; i++) {
      const uploadedFile = req.files[`Url${i}`];
      updatedData.AboutImage.push({
        title: req.body[`title${i}`],
        Url: {
          data: uploadedFile.data,
          contentType: uploadedFile.mimetype,
        }
        , ImageDescription: req.body[`ImageDescription${i}`]
      });
    }

    const result = await Layout1.findOneAndUpdate(
      { _id: _id },
      { $set: updatedData },
      { new: true } // ให้คืนค่าข้อมูลที่ถูกอัปเดต
    );

    const lessons = await Lesson.find().sort({ LessonNumber: 1 }).exec();
    const lessonId = result.LessonArrayObject[0].LessonId;
    const lesson = await Lesson.findById(lessonId);
    const layout01 = lesson.LayOut1ArrayObject;
    const layout02 = lesson.LayOut2ArrayObject;
    const layout03 = lesson.LayOut3ArrayObject;
    const layout04 = lesson.LayOut4ArrayObject;
    
  
    const foundLayouts = [];
    async function findLayoutsAndStoreData(deleteLayouts, Layout) {
  
      if (deleteLayouts.length > 0) {
        for (const layoutId of deleteLayouts) {
          const foundLayout = await Layout.findById(layoutId);
          if (foundLayout) {
            foundLayouts.push(foundLayout);
          }
        }
      }
  
      return foundLayouts;
    }
  
    const foundLayouts1 = await findLayoutsAndStoreData(layout01, Layout1);
    const foundLayouts2 = await findLayoutsAndStoreData(layout02, Layout2);
    const foundLayouts3 = await findLayoutsAndStoreData(layout03, Layout3);
    const foundLayouts4 = await findLayoutsAndStoreData(layout04, Layout4);
  
    foundLayouts.sort((a, b) => {
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
    res.render("adminEdit", { mytitle: "adminEdit", lesson, lessons, foundLayouts ,user:req.user});

  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
};

const makeEdit2 = async function (req, res, next) {
  req.user
  try {
    const _id = req.body._id;
    const Topic = req.body.Topic;
    const TextArea1 = req.body.TextArea1;
    const TextArea2 = req.body.TextArea3;
    const TextArea3 = req.body.TextArea3;
    const updatedData = {
      Topic: Topic,
      TextArea1: TextArea1,
      TextArea2: TextArea2,
      TextArea3: TextArea3,
    };

    const result = await Layout2.findOneAndUpdate(
      {_id: _id},
      { $set: updatedData },
      { new: true }
    );
    const lessons = await Lesson.find().sort({ LessonNumber: 1 }).exec();
    const lessonId = result.LessonArrayObject[0].LessonId;
    const lesson = await Lesson.findById(lessonId);
    const layout01 = lesson.LayOut1ArrayObject;
    const layout02 = lesson.LayOut2ArrayObject;
    const layout03 = lesson.LayOut3ArrayObject;
    const layout04 = lesson.LayOut4ArrayObject;
  
    const foundLayouts = [];
    async function findLayoutsAndStoreData(deleteLayouts, Layout) {
  
      if (deleteLayouts.length > 0) {
        for (const layoutId of deleteLayouts) {
          const foundLayout = await Layout.findById(layoutId);
          if (foundLayout) {
            foundLayouts.push(foundLayout);
          }
        }
      }
  
      return foundLayouts;
    }
  
    const foundLayouts1 = await findLayoutsAndStoreData(layout01, Layout1);
    const foundLayouts2 = await findLayoutsAndStoreData(layout02, Layout2);
    const foundLayouts3 = await findLayoutsAndStoreData(layout03, Layout3);
    const foundLayouts4 = await findLayoutsAndStoreData(layout04, Layout4);
  
    foundLayouts.sort((a, b) => {
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
    res.render("adminEdit", { mytitle: "adminEdit", lesson, lessons, foundLayouts ,user:req.user});

  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
};

const makeEdit3 = async function (req, res, next) {
  req.user
  try {
    const _id = req.body._id;
    const uploadedFile = req.files.FileForm;

    const updatedData = {
      Description: req.body.Description,
      File: {
        data: uploadedFile.data,
        contentType:uploadedFile.mimetype,
      }
    }

    const result = await Layout3.findOneAndUpdate(
      { _id: _id },
      { $set: updatedData },
      { new: true } // ให้คืนค่าข้อมูลที่ถูกอัปเดต
    );

    const lessons = await Lesson.find().sort({ LessonNumber: 1 }).exec();
    const lessonId = result.LessonArrayObject[0].LessonId;
    const lesson = await Lesson.findById(lessonId);
    const layout01 = lesson.LayOut1ArrayObject;
    const layout02 = lesson.LayOut2ArrayObject;
    const layout03 = lesson.LayOut3ArrayObject;
    const layout04 = lesson.LayOut4ArrayObject;
  
    const foundLayouts = [];
    async function findLayoutsAndStoreData(deleteLayouts, Layout) {
  
      if (deleteLayouts.length > 0) {
        for (const layoutId of deleteLayouts) {
          const foundLayout = await Layout.findById(layoutId);
          if (foundLayout) {
            foundLayouts.push(foundLayout);
          }
        }
      }
  
      return foundLayouts;
    }
  
    const foundLayouts1 = await findLayoutsAndStoreData(layout01, Layout1);
    const foundLayouts2 = await findLayoutsAndStoreData(layout02, Layout2);
    const foundLayouts3 = await findLayoutsAndStoreData(layout03, Layout3);
    const foundLayouts4 = await findLayoutsAndStoreData(layout04, Layout4);
  
    foundLayouts.sort((a, b) => {
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
    res.render("adminEdit", { mytitle: "adminEdit", lesson, lessons, foundLayouts ,user:req.user});

  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
};

const makeEdit4 = async function (req, res, next) {
  req.user
  try {
    const _id = req.body._id;

    const updatedData = {
      Topic: req.body.Topic,
      Description: req.body.Description,
      Lists: [],
    };

    const finalCountImg = req.body.finalCountImg;
    for (let i = 0; i <= finalCountImg.length; i++) {
      updatedData.Lists.push({
        list: req.body[`list${i}`],
      });

    const result = await Layout4.findOneAndUpdate(
      { _id: _id },
      { $set: updatedData },
      { new: true } 
    );
    }

    const lessons = await Lesson.find().sort({ LessonNumber: 1 }).exec();
    const lessonId = result.LessonArrayObject[0].LessonId;
    const lesson = await Lesson.findById(lessonId);
    const layout01 = lesson.LayOut1ArrayObject;
    const layout02 = lesson.LayOut2ArrayObject;
    const layout03 = lesson.LayOut3ArrayObject;
    const layout04 = lesson.LayOut4ArrayObject;
  
    const foundLayouts = [];
    async function findLayoutsAndStoreData(deleteLayouts, Layout) {
  
      if (deleteLayouts.length > 0) {
        for (const layoutId of deleteLayouts) {
          const foundLayout = await Layout.findById(layoutId);
          if (foundLayout) {
            foundLayouts.push(foundLayout);
          }
        }
      }
  
      return foundLayouts;
    }
  
    const foundLayouts1 = await findLayoutsAndStoreData(layout01, Layout1);
    const foundLayouts2 = await findLayoutsAndStoreData(layout02, Layout2);
    const foundLayouts3 = await findLayoutsAndStoreData(layout03, Layout3);
    const foundLayouts4 = await findLayoutsAndStoreData(layout04, Layout4);
  
    foundLayouts.sort((a, b) => {
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
    res.render("adminEdit", { mytitle: "adminEdit", lesson, lessons, foundLayouts,user:req.user });

  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}


module.exports = {
  deleteQuiz,
  editLesson,
  updateQuiz,
  makeEdit,
  makeEdit2,
  makeEdit3,
  makeEdit4
}
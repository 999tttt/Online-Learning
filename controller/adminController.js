const Lesson = require("../models/Lessons");
const Layout1 = require("../models/Layout1");
const fs = require('fs');
const path = require('path');
const Layout2 = require("../models/Layout2");
const Layout3 = require("../models/Layout3");
const Layout4 = require("../models/Layout4");
const Layout5 = require("../models/Layout5");
const Student = require("../models/student.model");
const Notification = require("../models/notification");
const User = require("../models/user.model");
const Comment = require("../models/comment");
const SchoolYear = require("../models/schoolYear");
const PDFDocument = require('pdfkit');
const atob = require('atob');
const fontPath = path.join(__dirname, 'THSarabunNew.ttf'); // ระบุที่อยู่ของไฟล์ฟอนต์ THSarabun.ttf
const multer = require('multer');
const upload = multer();
const { exec } = require('child_process');
const moment = require('moment');

const { createNotification } = require('./notificationController');
const { sendEmail } = require('../service/notification');

const adminIndex = async (req, res) => {
  try {
    const userData = await User.findById(req.session.userId);
    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    const getLessonId = req.query.lessonId;
    const lesson = await Lesson.findById(getLessonId);
    console.log(userData);
    const theme = req.session.theme || 'light'; 
    const isSidebarOpen = false; 
    res.render("adminIndex", { lessons, lesson, userData, theme, isSidebarOpen });
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}


const notLoggedIn = async (req, res) => {
  try {
    res.render("notLoggedIn");
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}

const manageStudent = async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    const getLessonId = req.query.lessonId;
    const lesson = await Lesson.findById(getLessonId);

    res.render("manageStudent", { lessons, lesson });
    // res.json(allStudents);

  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}

const uploadStudent = async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    const getLessonId = req.query.lessonId;
    const lesson = await Lesson.findById(getLessonId);
    const allStudents = await Student.find().populate('user');
    const theme = req.session.theme || 'light'; 
    const isSidebarOpen = false; 
    res.render("upload-excelAndmanual", { lessons, lesson, allStudents, theme , isSidebarOpen });
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}

const uploadStudent2 = async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    const getLessonId = req.query.lessonId;
    const lesson = await Lesson.findById(getLessonId);

    res.render("upload-file-2", { lessons, lesson });
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}

const getEditLessonNamePage = async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    const getLessonId = req.query.lessonId;
    const lesson = await Lesson.findById(getLessonId);

    res.render("EditLessonNamePage", { lessons, lesson });
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}

const editLessonName = async (req, res) => {
  try {
    const _id = req.body._id;

    const editNameNumber = {
      LessonName: req.body.LessonName,
      LessonNumber: req.body.LessonNumber
    }

    const result = await Lesson.findOneAndUpdate(
      { _id: _id },
      { $set: editNameNumber },
      { new: true }
    );

    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    res.render("adminLessonIndex", { mytitle: "adminLessonIndex", lessons });
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}


const adminLessonIndex = async (req, res) => {
  try {
    const originPage = req.query.originPage;
    const lessons = await Lesson.find().sort({ createdAt: 1 }).populate("schoolYear");
    // console.log(lessons)
    const schoolYears = await SchoolYear.find().sort({ schoolYear: 0 });
    const findYear = null;
    console.log(lessons);
    const theme = req.session.theme || 'light'; 
    const isSidebarOpen = false; 
    res.render("adminLessonIndex", { mytitle: "adminLessonIndex", lessons, originPage: originPage, schoolYears, findYear,theme ,isSidebarOpen });

  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}

const schoolYearRender = async (req, res) => {
  try {
    const originPage = req.query.originPage;
    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    const schoolYears = await SchoolYear.find().sort({ schoolYear: 0 });
    const selectedYear = req.query.year;
    // console.log(selectedYear)
    const findYear = await SchoolYear.findOne({ schoolYear: selectedYear });
    res.redirect(`/adminLessonIndex?lessons=${JSON.stringify(lessons)}&originPage=${originPage}&findYear=${JSON.stringify(findYear)}`);


  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}


const addLesson = async (req, res) => {
  try {
    const schoolYearId = req.query.schoolYearId;
    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    const schoolYears = await SchoolYear.find().sort({ schoolYear: 0 });
    const theme = req.session.theme || 'light'; 
    const isSidebarOpen = false; 
    res.render("addLesson", { mytitle: "addLesson", lessons, schoolYears, schoolYearId, theme ,isSidebarOpen  });
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }

}

const copyLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: 1 }).populate("schoolYear");
    const schoolYears = await SchoolYear.find().sort({ schoolYear: 0 });
    const findYear = null;

    res.render("copyLessons", { mytitle: "copyLessons", lessons, schoolYears, findYear });
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }

}

const createLayout = async function (req, res, next) {

  try {
    const userData = await User.findById(req.session.userId);
    const schoolYear = req.body.schoolYear;
    const checkExists = await SchoolYear.findOne({ schoolYear });
    const users = await User.find();
    const whatCome = "มีบทเรียนเรื่อง";
    const subject = "บทเรียนใหม่จาก Online Dentristy Learning";
    const name = req.body.lessonName;
    if (checkExists) {
      if (req.file) {
        const file = req.file.path;
        // const uploadedFile = req.files.LessonImage;
        const lessonCreate = new Lesson({
          LessonName: name,
          file,
          schoolYear: checkExists._id
        });
        await lessonCreate.save();
        const addId = await SchoolYear.findByIdAndUpdate(
          checkExists._id,
          { $push: { lessonArray: lessonCreate._id } },
          { new: true }
        );
        const schYear = addId.schoolYear;
        const lessons = await Lesson.find().sort({ createdAt: 1 }).populate("schoolYear");
        const lessonId = lessonCreate._id;
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
        // res.json(foundLayouts)
        // res.json(lay01_contents)
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

        res.render("eachLessons", { mytitle: "eachLessons", lesson, lessons, foundLayouts, schYear });
        // console.log(addId)
        // const lesson_id = lesson._id;
        // const lesson_name = lesson.lessonName;
        // res.render("adminCreateLayout", { mytitle: "adminCreateLayout", lesson, lesson_id, lesson_name });
      } else {
        const lessonCreate = new Lesson({
          LessonName: name,
          schoolYear: checkExists._id
        });
        await lessonCreate.save();
        const addId = await SchoolYear.findByIdAndUpdate(
          checkExists._id,
          { $push: { lessonArray: lessonCreate._id } },
          { new: true }
        );
        const schYear = addId.schoolYear;

        // console.log(addId)
        const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
        const lessonId = lessonCreate._id;
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
        // res.json(foundLayouts)
        // res.json(lay01_contents)
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

        res.render("eachLessons", { mytitle: "eachLessons", lesson, lessons, foundLayouts, schYear });
        // res.render("adminCreateLayout", { mytitle: "adminCreateLayout", lesson, lesson_id, lesson_name });
      }
    } else if (!checkExists) {
      const creataSchoolYear = new SchoolYear({
        schoolYear: schoolYear
      });
      await creataSchoolYear.save()
      if (req.file) {
        // const uploadedFile = req.files.LessonImage;
        const file = req.file.path;

        const lessonCreate = new Lesson({
          LessonName: name,
          file,
          schoolYear: creataSchoolYear._id
        });
        await lessonCreate.save();
        const addId = await SchoolYear.findByIdAndUpdate(
          creataSchoolYear._id,
          { $push: { lessonArray: lessonCreate._id } },
          { new: true }
        );
        const schYear = addId.schoolYear;
        const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
        const lessonId = lessonCreate._id;
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
        // res.json(foundLayouts)
        // res.json(lay01_contents)
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

        res.render("eachLessons", { mytitle: "eachLessons", lesson, lessons, foundLayouts, schYear });
        // res.render("adminCreateLayout", { mytitle: "adminCreateLayout", lesson, lesson_id, lesson_name });
      } else {
        const lessonCreate = new Lesson({
          LessonName: name,
          schoolYear: creataSchoolYear._id
        });
        await lessonCreate.save();
        const addId = await SchoolYear.findByIdAndUpdate(
          creataSchoolYear._id,
          { $push: { lessonArray: lessonCreate._id } },
          { new: true }
        );
        const schYear = addId.schoolYear;
        const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
        const lessonId = lessonCreate._id;
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
        // res.json(foundLayouts)
        // res.json(lay01_contents)
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

        res.render("eachLessons", { mytitle: "eachLessons", lesson, lessons, foundLayouts, schYear });
        // res.render("adminCreateLayout", { mytitle: "adminCreateLayout", lesson, lesson_id, lesson_name });
      }
    }

  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }

}


// const createLayout_01 = async (req, res) => {
//     try {
//         const { _id, Topic, MainDescription, SubDescription, title, ImageDescription } = req.body;
//         const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);

//         const Url = {
//           data: fs.readFileSync(filePath),
//         };

//         const newLayout = new Layout1({
//           Topic,
//           MainDescription,
//           SubDescription,
//           AboutImage: {
//             title,
//             Url,
//             ImageDescription,
//           },
//           LessonArrayObject: [{ LessonId: _id }],
//         });

//         const savedLayout = await newLayout.save();

//         const lessons = await Lesson.findByIdAndUpdate(
//           _id,
//           { $push: { LayOut1ArrayObject: savedLayout._id } },
//           { new: true }
//         );

//         res.redirect('addLesson');
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("เกิดข้อผิดพลาด");
//     }
// };


const eachLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    const lessonId = req.query.lessonId;
    const lesson = await Lesson.findById(lessonId).populate("schoolYear");
    // const lessonComment = await Lesson.findById(lessonId).populate("comments");
    const userData = await User.findById(req.session.userId);

    const schYear = lesson.schoolYear.schoolYear;
    const layout01 = lesson.LayOut1ArrayObject;
    const layout02 = lesson.LayOut2ArrayObject;
    const layout03 = lesson.LayOut3ArrayObject;
    const layout04 = lesson.LayOut4ArrayObject;
    const layout05 = lesson.LayOut5ArrayObject;

    const lessonComment = await Lesson.findById(lessonId)
      .populate({
        path: "comments",
        populate: {
          path: "user",
        }
      });

    // ฟังก์ชันสำหรับจัดรูปแบบวันที่
    function formatDate(date) {
      const formattedDate = moment(date).format("DD/MM/YYYY HH:mm A");
      return formattedDate;
    }

    // ฟังก์ชันสำหรับคำนวณจำนวนวันที่ผ่านไป
    function timeSince(date) {
      const now = moment();
      const seconds = now.diff(date, "seconds");
      const minutes = now.diff(date, "minutes");
      const hours = now.diff(date, "hours");
      const days = now.diff(date, "days");
      const weeks = now.diff(date, "weeks");
      const months = now.diff(date, "months");

      if (seconds < 60) {
        return `${seconds} วินาทีที่แล้ว`;
      } else if (minutes < 60) {
        return `${minutes} นาทีที่แล้ว`;
      } else if (hours < 24) {
        return `${hours} ชั่วโมงที่แล้ว`;
      } else if (days < 7) {
        return `${days} วันที่แล้ว`;
      } else if (weeks < 4) {
        return `${weeks} สัปดาห์ ${days % 7} วันที่แล้ว`;
      } else if (months < 12) {
        return `${months} เดือนที่แล้ว`;
      } else {
        return moment(date).format("YYYY-MM-DD");
      }
    }

    // แก้ไข comments โดยใช้ map ฟังก์ชัน
    lessonComment.comments = lessonComment.comments.map((comment) => {
      comment.createdAtFormatted = formatDate(comment.createdAt);
      comment.timeSince = timeSince(comment.createdAt);
      return comment;
    });

    let pdfLists = [];
    for (const id of layout05) {
      const findLayout = await Layout5.findById(id);
    }

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
    const foundLayouts5 = await findLayoutsAndStoreData(layout05, Layout5);

    // console.log(foundLayouts5);

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
    // res.json(foundLayouts)
    // res.json(lay01_contents)
    res.render("eachLessons", { mytitle: "eachLessons", lesson, lessons, foundLayouts, schYear, lessonComment, userData });
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}

const eachLessonStudent = async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    const lessonId = req.query.lessonId;
    const lesson = await Lesson.findById(lessonId).populate("schoolYear");
    // const lessonComment = await Lesson.findById(lessonId).populate("comments");
    const userData = await User.findById(req.session.userId);

    const schYear = lesson.schoolYear.schoolYear;
    const layout01 = lesson.LayOut1ArrayObject;
    const layout02 = lesson.LayOut2ArrayObject;
    const layout03 = lesson.LayOut3ArrayObject;
    const layout04 = lesson.LayOut4ArrayObject;
    const layout05 = lesson.LayOut5ArrayObject;

    const lessonComment = await Lesson.findById(lessonId)
      .populate({
        path: "comments",
        populate: {
          path: "user",
        }
      });

    // ฟังก์ชันสำหรับจัดรูปแบบวันที่
    function formatDate(date) {
      const formattedDate = moment(date).format("DD/MM/YYYY HH:mm A");
      return formattedDate;
    }

    // ฟังก์ชันสำหรับคำนวณจำนวนวันที่ผ่านไป
    function timeSince(date) {
      const now = moment();
      const seconds = now.diff(date, "seconds");
      const minutes = now.diff(date, "minutes");
      const hours = now.diff(date, "hours");
      const days = now.diff(date, "days");
      const weeks = now.diff(date, "weeks");
      const months = now.diff(date, "months");

      if (seconds < 60) {
        return `${seconds} วินาทีที่แล้ว`;
      } else if (minutes < 60) {
        return `${minutes} นาทีที่แล้ว`;
      } else if (hours < 24) {
        return `${hours} ชั่วโมงที่แล้ว`;
      } else if (days < 7) {
        return `${days} วันที่แล้ว`;
      } else if (weeks < 4) {
        return `${weeks} สัปดาห์ ${days % 7} วันที่แล้ว`;
      } else if (months < 12) {
        return `${months} เดือนที่แล้ว`;
      } else {
        return moment(date).format("YYYY-MM-DD");
      }
    }

    // แก้ไข comments โดยใช้ map ฟังก์ชัน
    lessonComment.comments = lessonComment.comments.map((comment) => {
      comment.createdAtFormatted = formatDate(comment.createdAt);
      comment.timeSince = timeSince(comment.createdAt);
      return comment;
    });

    let pdfLists = [];
    for (const id of layout05) {
      const findLayout = await Layout5.findById(id);
    }

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
    const foundLayouts5 = await findLayoutsAndStoreData(layout05, Layout5);

    // console.log(foundLayouts5);

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
    // res.json(foundLayouts)
    // res.json(lay01_contents)
    res.render("eachLessonStudent", { mytitle: "eachLessons", lesson, lessons, foundLayouts, schYear, lessonComment, userData });
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}

const adminExamsIndex = async (req, res) => {
  try {
    res.render("adminExam");
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }

}

const pdfDowload = async (req, res) => {
  try {
    const LayoutId = req.query.id;
    const layout = await Layout5.findById(LayoutId);
    if (!layout) {
      return res.status(404).send('Layout not found');
    }
    // สร้าง PDF
    const base64Data = layout.PdfFile.content.toString('base64');
    const buffer = Buffer.from(base64Data, 'base64');
    // สร้าง PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', `inline; filename="${layout.PdfFile.filename}"`);
    // เขียนข้อมูลลงใน PDF
    doc.pipe(res);
    doc.font(fontPath) // กำหนดฟอนต์ภาษาไทย
      .fontSize(12)
      .text(buffer.toString('utf-8'), 100, 100); // แสดงข้อความ
    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const showFile = async (req, res) => {
  try {
    const pdfId = req.query.pdfId;
    // const { id } = req.params;
    const item = await Layout5.findById(pdfId);
    if (!item) {
      return next(new Error("No item found"));
    }
    const file = item.file;
    const filePath = path.join(__dirname, `../${file}`);

    // Set content type header
    res.setHeader('Content-Type', 'application/pdf');

    // Send the PDF file directly
    fs.createReadStream(filePath).pipe(res);

    // const base64String = Buffer.from(pdfData.PdfFile.content).toString('base64');
    // const blob = new Blob([base64String], { type: 'application/pdf' });
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', 'attachment; filename="' + pdfData.filename + '"');
    // res.send(blob);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving PDF');
  }
};

const logsFile = async (req, res) => {
  try {
    const userData = await User.findById(req.session.userId);
    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    const getLessonId = req.query.lessonId;
    const lesson = await Lesson.findById(getLessonId);
    console.log(userData);
    res.render("logsFile", { lessons, lesson, userData });
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}

const teacherNotification = async (req, res) => {
  try {
    const userData = await User.findById(req.session.userId);
    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    const getLessonId = req.query.lessonId;
    const lesson = await Lesson.findById(getLessonId);
    // const notifications = await Notification.find().sort({ createdAt: -1 }).exec();

    const { page = 1, limit = 1 } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 } // เรียงลำดับจากใหม่ไปเก่า
    };

    const notifications = await Notification.paginate({}, options);

    res.render("teacherNoti", { lessons, lesson, userData, notifications });
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}

const createComment = async (req, res) => {
  try {
    const { comment, lessonId } = req.body;
    const files = req.files;
    const userData = await User.findById(req.session.userId);

    const createComment = new Comment(
      {
        comment: comment,
        user: userData._id,
        Lesson: lessonId
      }
    )
    await createComment.save();

    // console.log(files);
    const fileData = files.map(files => {
      return {
        file: files.filename,
        contentType: files.mimetype
      };
    });
    await createComment.save();

    const commentId = createComment._id;
    for (const i of fileData) {
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { $push: { files: i } },
        { new: true }
      );
    }

    const addCommentIntoLesson = await Lesson.findByIdAndUpdate(
      lessonId,
      { $push: { comments: commentId } },
      { new: true }
    )

    if (userData.role == "teacher") {
      res.redirect(`/adminIndex/eachLessons?lessonId=${lessonId}`)

    } else if (userData.role == "student") {
      res.redirect(`/studentIndex/eachLessonStudent?lessonId=${lessonId}`)
    }
    // res.json(files);
    // console.log(files);
  } catch (err) {
    console.log(err)
  }
}

const editComment = async (req, res) => {
  try {
    const commentId = req.query.commentId;
    // const getComment = await Comment.findById(commentId);
    const userData = await User.findById(req.session.userId);
    const lessonId = req.query.lessonId;

    const getComment = await Comment.findById(commentId).populate("user");

    // ฟังก์ชันสำหรับจัดรูปแบบวันที่
    function formatDate(date) {
      const formattedDate = moment(date).format("DD/MM/YYYY HH:mm A");
      return formattedDate;
    }

    // ฟังก์ชันสำหรับคำนวณจำนวนวันที่ผ่านไป
    function timeSince(date) {
      const now = moment();
      const seconds = now.diff(date, "seconds");
      const minutes = now.diff(date, "minutes");
      const hours = now.diff(date, "hours");
      const days = now.diff(date, "days");
      const weeks = now.diff(date, "weeks");
      const months = now.diff(date, "months");

      if (seconds < 60) {
        return `${seconds} วินาทีที่แล้ว`;
      } else if (minutes < 60) {
        return `${minutes} นาทีที่แล้ว`;
      } else if (hours < 24) {
        return `${hours} ชั่วโมงที่แล้ว`;
      } else if (days < 7) {
        return `${days} วันที่แล้ว`;
      } else if (weeks < 4) {
        return `${weeks} สัปดาห์ ${days % 7} วันที่แล้ว`;
      } else if (months < 12) {
        return `${months} เดือนที่แล้ว`;
      } else {
        return moment(date).format("YYYY-MM-DD");
      }
    }

    // แก้ไข getComment โดยใช้ฟังก์ชัน formatDate และ timeSince
    getComment.createdAtFormatted = formatDate(getComment.createdAt);
    getComment.timeSince = timeSince(getComment.createdAt);

    // console.log(getComment);
    // res.json(getComment)
    res.render("editComment", { userData, getComment, lessonId });
    // if (userData.role == "teacher") {
    // res.render("editComment", { userData, getComment, lessonId });
    // } else if (userData.role == "student") {
    //   res.redirect(`/studentIndex/eachLessonStudent?lessonId=${lessonId}`)
    // }
  } catch (err) {
    console.log(err)
  }
}

const editCommentStudent = async (req, res) => {
  try {
    const commentId = req.query.commentId;
    // const getComment = await Comment.findById(commentId);
    const userData = await User.findById(req.session.userId);
    const lessonId = req.query.lessonId;

    const getComment = await Comment.findById(commentId).populate("user");

    // ฟังก์ชันสำหรับจัดรูปแบบวันที่
    function formatDate(date) {
      const formattedDate = moment(date).format("DD/MM/YYYY HH:mm A");
      return formattedDate;
    }

    // ฟังก์ชันสำหรับคำนวณจำนวนวันที่ผ่านไป
    function timeSince(date) {
      const now = moment();
      const seconds = now.diff(date, "seconds");
      const minutes = now.diff(date, "minutes");
      const hours = now.diff(date, "hours");
      const days = now.diff(date, "days");
      const weeks = now.diff(date, "weeks");
      const months = now.diff(date, "months");

      if (seconds < 60) {
        return `${seconds} วินาทีที่แล้ว`;
      } else if (minutes < 60) {
        return `${minutes} นาทีที่แล้ว`;
      } else if (hours < 24) {
        return `${hours} ชั่วโมงที่แล้ว`;
      } else if (days < 7) {
        return `${days} วันที่แล้ว`;
      } else if (weeks < 4) {
        return `${weeks} สัปดาห์ ${days % 7} วันที่แล้ว`;
      } else if (months < 12) {
        return `${months} เดือนที่แล้ว`;
      } else {
        return moment(date).format("YYYY-MM-DD");
      }
    }

    // แก้ไข getComment โดยใช้ฟังก์ชัน formatDate และ timeSince
    getComment.createdAtFormatted = formatDate(getComment.createdAt);
    getComment.timeSince = timeSince(getComment.createdAt);

    // console.log(getComment);
    // res.json(getComment)
    res.render("editCommentStudent", { userData, getComment, lessonId });
  } catch (err) {
    console.log(err)
  }
}

const makeEditComment = async (req, res,) => {
  try {
    const { commentId, comment } = req.body;
    // console.log(commentId);
    const files = req.files;

    const updateComment = await Comment.findByIdAndUpdate(
      commentId,
      { $set: { comment: comment } },
      { new: true }
    )

    // ลบไฟล์ที่ถูกติ๊กออกจากโฟลเดอร์และฐานข้อมูล
    const filesToKeep = [];
    const filesToDelete = [];

    updateComment.files.forEach((file, index) => {
      if (req.body[`file${index}`]) {
        filesToDelete.push(file.file);
      } else {
        filesToKeep.push(file);
      }
    });

    // ลบไฟล์จากโฟลเดอร์ uploads
    filesToDelete.forEach(file => {
      const filePath = path.join(__dirname, '..', 'uploads', file);
      fs.unlink(filePath, err => {
        if (err) {
          console.error(`Error deleting file ${file}: `, err);
        }
      });
    });

    // อัปเดตเอกสารในฐานข้อมูล
    updateComment.comment = comment;
    updateComment.files = filesToKeep;
    await updateComment.save();

    const fileData = files.map(files => {
      return {
        file: files.filename,
        contentType: files.mimetype
      };
    });

    for (const i of fileData) {
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { $push: { files: i } },
        { new: true }
      );
    }

    res.redirect(`/adminIndex/editComment?commentId=${commentId}`)
  } catch (err) {
    console.log(err);
  }
}

const deleteComment = async (req, res) => {
  try {
    const commentId = req.query.commentId;
    const lessonId = req.query.lessonId;
    const comment = await Comment.findById(commentId);
    const userData = await User.findById(req.session.userId);

   
    comment.files.forEach(file => {
      const filePath = path.join(__dirname, '..', 'uploads', file.file);
      fs.unlink(filePath, err => {
        if (err) {
          console.error(`Error deleting file ${file.file}: `, err);
        }
      });
    });

    await Comment.findByIdAndDelete(commentId);
     
    if (userData.role == "teacher") {
      res.redirect(`/adminIndex/eachLessons?lessonId=${lessonId}`)
    } else if (userData.role == "student") {
      res.redirect(`/studentIndex/eachLessonStudent?lessonId=${lessonId}`)
    }

  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  adminIndex,
  adminLessonIndex,
  adminExamsIndex,
  addLesson,
  createLayout,
  eachLessons,
  getEditLessonNamePage,
  editLessonName,
  manageStudent,
  uploadStudent,
  uploadStudent2,
  schoolYearRender,
  copyLessons,
  pdfDowload,
  showFile,
  notLoggedIn,
  logsFile,
  teacherNotification,
  createComment,
  editComment,
  makeEditComment,
  deleteComment,
  eachLessonStudent,
  editCommentStudent
}
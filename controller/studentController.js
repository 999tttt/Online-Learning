var User = require('../models/user.model')
var Student = require('../models/student.model')
const Lesson = require("../models/Lessons");
const SchoolYear = require("../models/schoolYear");
var Quiz = require('../models/quiz')

const studentIndex = async (req, res) => {
    try {
        const userData = await User.findById(req.session.userId)
            .populate({
                path: "student",
                populate: {
                    path: "schoolYear",

                }
            });
        const schoolYears = await SchoolYear.find().sort({ schoolYear: 0 });
        // const getUserLessons = userData.student.schoolYear.lessonArray;
        const findYear = null;
        const theme = req.session.theme || 'light'; 
        const isSidebarOpen = false; 
        // console.log(getUserLessons.length);

        // res.json(userData);
        res.render("studentIndex", { schoolYears,findYear,userData,theme,isSidebarOpen  });
    } catch (err) {
        console.error(err);
        res.status(500).send("เกิดข้อผิดพลาด");
    }
}

const studentLesson = async (req, res) => {
    try {
        const userData = await User.findById(req.session.userId)
            .populate({
                path: "student",
                populate: {
                    path: "schoolYear",
                    populate : {
                        path: "lessonArray"
                    }
                }
            });
            const theme = req.session.theme || 'light'; 
            const isSidebarOpen = false;
        // const getUserLessons = userData.student.schoolYear.lessonArray;
        res.render("studentLessons", { userData, theme, isSidebarOpen});
    } catch (error) {
        console.error(error);
    }
}

const studentAssignment = async (req, res) => {
    try {
        const userData = await User.findById(req.session.userId)
            .populate({
                path: "student",
                populate: {
                    path: "schoolYear",
                    populate : {
                        path: "Assignments"
                    }
                }
            });
            const theme = req.session.theme || 'light'; 
            const isSidebarOpen = false;
        // const getUserLessons = userData.student.schoolYear.lessonArray;
        res.render("studentAssignment", { userData, theme, isSidebarOpen });
    } catch (error) {
        console.error(error);
    }
}

const studentExam = async (req, res) => {
    try {
        const userData = await User.findById(req.session.userId)
            .populate({
                path: "student",
                populate: {
                    path: "schoolYear",
                    populate : {
                        path: "Exam"
                    }
                }
            });
            const quiz = await Quiz.find({ isReleased: true }).populate('schoolYear').sort({ releaseDate: 1 });
            const theme = req.session.theme || 'light'; 
            const schoolYears = await SchoolYear.find().sort({ schoolYear: 0 });
            // const getUserLessons = userData.student.schoolYear.lessonArray;
            const findYear = null;
            const isSidebarOpen = false;
        // const getUserLessons = userData.student.schoolYear.lessonArray;
        res.render("studentExam", { userData, quiz ,schoolYears,findYear,theme, isSidebarOpen });
    } catch (error) {
        console.error(error);
    }
}

const eachLessonStudent = async (req, res) => {
    try {
        const userData = await User.findById(req.session.userId)
            .populate({
                path: "student",
                populate: {
                    path: "schoolYear",
                    populate : {
                        path: "lessonArray"
                    }
                }
            });
            const theme = req.session.theme || 'light'; 
            const isSidebarOpen = false;
        // const getUserLessons = userData.student.schoolYear.lessonArray;
        res.render("eachLessonStudent", { userData, theme, isSidebarOpen});
    } catch (error) {
        console.error(error);
    }
}
  
  const eachQuizStudent = async(req, res) => {
    try {
        const userData = await User.findById(req.session.userId)
            .populate({
                path: "student",
                populate: {
                    path: "schoolYear",
                    populate : {
                        path: "Exam"
                    }
                }
            });
            const quiz = await Quiz.find().sort({ createdAt: 1 }).populate("schoolYear");
            const theme = req.session.theme || 'light'; 
            const isSidebarOpen = false;
        // const getUserLessons = userData.student.schoolYear.lessonArray;
        res.render("eachQuizStudent", { userData, quiz ,theme, isSidebarOpen });
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    studentIndex,
    studentLesson,
    studentAssignment,
    studentExam,
    eachLessonStudent,
    eachQuizStudent

}
var User = require('../models/user.model')
var Student = require('../models/student.model')
const Lesson = require("../models/Lessons");

const studentIndex = async (req, res) => {
    try {
        const userData = await User.findById(req.session.userId)
            .populate({
                path: "student",
                populate: {
                    path: "schoolYear",

                }
            });
        const getUserLessons = userData.student.schoolYear.lessonArray;
        // console.log(getUserLessons.length);

        // res.json(userData);
        res.render("studentIndex", { getUserLessons });
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
        // const getUserLessons = userData.student.schoolYear.lessonArray;
        res.render("studentLessons", { userData });
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
        // const getUserLessons = userData.student.schoolYear.lessonArray;
        res.render("studentAssignment", { userData });
    } catch (error) {
        console.error(error);
    }
}
module.exports = {
    studentIndex,
    studentLesson,
    studentAssignment
}
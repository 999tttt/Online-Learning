var Quiz = require('../models/quiz')
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

exports.sendQuizAnswers = async (req, res) => {
    // ค้นหา quizId จาก URL parameters
    const quizId =Quiz._id; 
    const answers = req.body.answers; // รับ answers จาก body

    console.log("Received data:", { quizId, answers });

    // ตรวจสอบว่าข้อมูลทั้งหมดมีหรือไม่
    if (!quizId || !answers) {
        console.log("Missing data:", { quizId, answers });
        return res.status(400).json({ success: false, message: 'ข้อมูลไม่ครบถ้วนในการส่งคำตอบ' });
    }

    try {
        // ค้นหา quiz โดยใช้ quizId
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'ไม่พบแบบทดสอบ' });
        }

        // หา user ID จาก req.user
        const studentId = req.user._id; // ใช้ user._id แทน

        // หา attempt ของนักเรียน
        let studentAttempt = quiz.attempts.find(attempt => attempt.studentId.toString() === studentId.toString());

        if (studentAttempt) {
            if (studentAttempt.attemptCount >= quiz.attemptLimit) {
                return res.status(400).json({ success: false, message: 'คุณทำแบบทดสอบครบจำนวนครั้งที่กำหนดแล้ว' });
            }
            studentAttempt.attemptCount += 1; // เพิ่มจำนวนครั้งในการทำแบบทดสอบ
        } else {
            // ถ้ายังไม่มีการทำแบบทดสอบให้สร้าง attempt ใหม่
            studentAttempt = { studentId, attemptCount: 1, answers: [], score: 0 };
            quiz.attempts.push(studentAttempt);
        }

        // ตรวจสอบคำตอบและคำนวณคะแนน
        let totalScore = 0;
        quiz.questions.forEach((question, i) => {
            const studentAnswer = answers[i]; // ดึงคำตอบของนักเรียนจาก answers
            if (question.answerKey === studentAnswer) {
                totalScore += question.points; // เพิ่มคะแนนถ้าคำตอบถูกต้อง
            }
            // บันทึกคำตอบของนักเรียนในแต่ละข้อ
            studentAttempt.answers.push({ questionId: question._id, answer: studentAnswer });
        });

        // อัปเดตคะแนนใน attempt ของนักเรียน
        studentAttempt.score = totalScore;

        // บันทึกการเปลี่ยนแปลงลงในฐานข้อมูล
        await quiz.save();

        // ส่งข้อมูลตอบกลับไปยังลูกค้า
        res.json({ success: true, message: 'ส่งแบบทดสอบสำเร็จ', score: totalScore });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการส่งแบบทดสอบ' });
    }
};





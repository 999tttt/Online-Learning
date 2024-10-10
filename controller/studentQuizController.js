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

exports.submitQuiz = async (req, res) => {
    const { quizId, studentId } = req.body;

    try {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'ไม่พบแบบทดสอบ' });
        }

        // หา attempt ของนักเรียน
        const studentAttempt = quiz.attempts.find(attempt => attempt.studentId.toString() === studentId);

        // ถ้าพบนักเรียนใน attempts ให้ตรวจสอบจำนวนครั้ง
        if (studentAttempt) {
            if (studentAttempt.attemptCount >= quiz.attemptLimit) {
                return res.status(400).json({ success: false, message: 'คุณทำแบบทดสอบครบจำนวนครั้งที่กำหนดแล้ว' });
            }
            // ถ้าจำนวนครั้งยังไม่เกิน ให้เพิ่มจำนวนครั้ง
            studentAttempt.attemptCount += 1;
        } else {
            // ถ้านักเรียนยังไม่เคยทำแบบทดสอบนี้ ให้เพิ่ม entry ใหม่ใน attempts
            quiz.attempts.push({ studentId, attemptCount: 1 });
        }

        // บันทึกการเปลี่ยนแปลงลงในฐานข้อมูล
        await quiz.save();

        res.json({ success: true, message: 'ส่งแบบทดสอบสำเร็จ' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการส่งแบบทดสอบ' });
    }
};
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user.model');

// const profileIndex = (req, res) => {
//   // ตรวจสอบสถานะล็อกอิน
//   if (req.user.role === 'student') {
//     // ถ้าเป็น role นักเรียน ให้ render profile_st
//     res.render('profile_st', { user: req.user });
//   } else if (req.user.role === 'teacher') {
//     // ถ้าเป็น role อาจารย์ ให้ render profile_t
//     res.render('profile_t', { user: req.user });
//   } else {
//     // ถ้าเป็น role อื่น ๆ ที่ไม่ได้ระบุ ให้เลือก render profile
//     res.redirect('/login');
//   };
// };

// const editProfile = (req, res) => {
//     // ตรวจสอบสถานะล็อกอิน
//     if (req.user) {
//       // ถ้าล็อกอินแล้ว
//       // ดึงข้อมูลที่แก้ไขจาก req.body
//       const { fname, lname } = req.body;
  
//       // ทำการอัปเดตข้อมูลที่แก้ไขลงในฐานข้อมูล
//       User.findByIdAndUpdate(req.user.id, { fname, lname }, { new: true })
//         .then((updatedUser) => {
//           // หลังจากอัปเดตแล้ว, สามารถ redirect กลับไปที่หน้า profile หรือหน้าอื่น ๆ ตามที่คุณต้องการ
//           res.redirect('/profile');
//         })
//         .catch((error) => {
//           // หากเกิดข้อผิดพลาดในการอัปเดต, คุณสามารถจัดการตามที่คุณต้องการ
//           console.error(error);
//           res.redirect('/profile');
//         });
//     } else {
//       // ถ้ายังไม่ล็อกอิน ให้ redirect ไปยังหน้า login
//       res.redirect('/login');
//     }
// };

const profileIndex = (req, res) => {
  // ตรวจสอบสถานะล็อกอิน
  // if (req.user) {
    // ถ้าล็อกอินแล้ว
    const theme = req.session.theme || 'light'; 
    const isSidebarOpen = false; 
    // ทำการ render profile_st หรือ profile_t ตามบทบาทของผู้ใช้
    res.render('profile', { user: req.user, theme, isSidebarOpen });
  // } else {
  //   // ถ้ายังไม่ล็อกอิน ให้ redirect ไปยังหน้า login
  //   res.redirect('/login');
  // }
};
// }

const editProfile = (req, res) => {
  // ตรวจสอบสถานะล็อกอิน
  if (req.user) {
    // ถ้าล็อกอินแล้ว
    // ดึงข้อมูลที่แก้ไขจาก req.body
    const { fname, lname } = req.body;

    // ทำการอัปเดตข้อมูลที่แก้ไขลงในฐานข้อมูล
    User.findByIdAndUpdate(req.user.id, { fname, lname }, { new: true })
      .then((updatedUser) => {
        // หลังจากอัปเดตแล้ว, สามารถ redirect กลับไปที่หน้า profile หรือหน้าอื่น ๆ ตามที่คุณต้องการ
        res.redirect('/profile');
      })
      .catch((error) => {
        // หากเกิดข้อผิดพลาดในการอัปเดต, คุณสามารถจัดการตามที่คุณต้องการ
        console.error(error);
        res.redirect('/profile');
      });
    }
  }
//   } else {
//     // ถ้ายังไม่ล็อกอิน ให้ redirect ไปยังหน้า login
//     res.redirect('/login');
//   }
// };

module.exports = { profileIndex, editProfile };
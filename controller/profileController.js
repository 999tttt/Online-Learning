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

const editProfile = (req, res) => {
    // ตรวจสอบสถานะล็อกอิน
    if (req.session.userId) {
      // ถ้าล็อกอินแล้ว
      // ดึงข้อมูลที่แก้ไขจาก req.body
      const { fname, lname } = req.body;
  
      // ทำการอัปเดตข้อมูลที่แก้ไขลงในฐานข้อมูล
      User.findByIdAndUpdate(req.session.userId, { fname, lname }, { new: true })
        .then((updatedUser) => {
          // หลังจากอัปเดตแล้ว, สามารถ redirect กลับไปที่หน้า profile หรือหน้าอื่น ๆ ตามที่คุณต้องการ
          res.redirect('/profile');
        })
        .catch((error) => {
          // หากเกิดข้อผิดพลาดในการอัปเดต, คุณสามารถจัดการตามที่คุณต้องการ
          console.error(error);
          res.redirect('/profile');
        });
    } else {
      // ถ้ายังไม่ล็อกอิน ให้ redirect ไปยังหน้า login
      res.redirect('/login');
    }
};

const profileIndex = async(req, res) => {
    try{
    const userData = await User.findById(req.session.userId);
    const { fname, lname } = req.body;
    const theme = req.session.theme || 'light'; 
    const isSidebarOpen = false; 
    console.log(userData)
    res.render('profile', { userData, theme, isSidebarOpen, fname , lname });
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
};

const editProfileIndex = async(req, res) => {
  try{
    const userData = await User.findById(req.session.userId);
    const { fname, lname } = req.body;
    const theme = req.session.theme || 'light'; 
    const isSidebarOpen = false; 
    console.log(userData)
    res.render('edit_profile', { userData, theme, isSidebarOpen ,fname , lname});
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}



// const editProfile = (req, res) => {
//   // ตรวจสอบสถานะล็อกอิน
//   if (req.session.userId) {
//     // ถ้าล็อกอินแล้ว
//     // ดึงข้อมูลที่แก้ไขจาก req.body
//     const { fname, lname } = req.body;

//     console.log('Updating user:', req.session.userId, 'with data:', { fname, lname });

//     // ทำการอัปเดตข้อมูลที่แก้ไขลงในฐานข้อมูล
//     User.findByIdAndUpdate(req.session.userId, { fname, lname }, { new: true })
//       .then((updatedUser) => {
//         if (!updatedUser) {
//           console.error('User not found.');
//           return res.redirect('/profile');
//         }

//         console.log('User updated successfully:', updatedUser);

//         // Save session after update
//         req.session.save((err) => {
//           if (err) {
//             console.error('Session save error:', err);
//             return res.redirect('/profile');
//           }
//           res.redirect('/profile');
//         });
//       })
//       .catch((error) => {
//         // หากเกิดข้อผิดพลาดในการอัปเดต, คุณสามารถจัดการตามที่คุณต้องการ
//         console.error('Error updating user:', error);
//         res.redirect('/profile');
//       });
//   } else {
//     // ถ้ายังไม่ล็อกอิน ให้ redirect ไปยังหน้า login
//     res.redirect('/login');
//   }
// };


module.exports = { profileIndex, editProfileIndex , editProfile };
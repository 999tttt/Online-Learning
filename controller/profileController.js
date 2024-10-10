var express = require('express');
var multer = require('multer');
const imgUpload = require('../middleware/multer'); // นำเข้า middleware multer
var router = express.Router();
var passport = require('passport');
const Teacher = require("../models/teacher.model");
const Student = require("../models/student.model");
var User = require('../models/user.model');



const profileIndex = async (req, res) => {
  try {
    // ตรวจสอบว่าหน้าปัจจุบันคือหน้า edit หรือไม่
    const isEditPage = req.originalUrl.includes('/edit');

    const userData = await User.findById('65a57db82f095952332b383e');
    // const fname = req.session.fname;
    // const lname = req.session.lname;
    // const nickname = req.session.nickname;
    // const notes = req.session.notes;
    // const theme = req.session.theme || 'light';
    const isSidebarOpen = false;


    if (isEditPage) {
      res.render('edit_profile',  {userData} );
         } else {
          res.render('profile',  {userData});
        }

  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
  // if (req.session.userId) {
  //   try {
  //     // ตรวจสอบว่าหน้าปัจจุบันคือหน้า edit หรือไม่
  //     const isEditPage = req.originalUrl.includes('/edit');

  //     const userData = await User.findById(req.session.userId);
  //     const fname = req.session.fname;
  //     const lname = req.session.lname;
  //     const nickname = req.session.nickname;
  //     const notes = req.session.notes;
  //     const theme = req.session.theme || 'light';
  //     const isSidebarOpen = false;

  //     console.log(userData);

  //     if (isEditPage) {
  //       res.render('edit_profile', { userData, theme, isSidebarOpen, fname, lname, nickname, notes });
  //     } else {
  //       res.render('profile', { userData, theme, isSidebarOpen, fname, lname, nickname, notes });
  //     }

  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).send("เกิดข้อผิดพลาด");
  //   }
  // } else {
  //   res.redirect('/');
  // }
};


// const upload = multer({
//   storage: multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/'); // โฟลเดอร์ที่จะบันทึกไฟล์
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname); // กำหนดชื่อไฟล์
//     }
//   }),
//   limits: { fileSize: 50 * 1024 * 1024 }, // จำกัดขนาดไฟล์ที่ 50MB
//   fileFilter: function (req, file, cb) {
//     // อนุญาตเฉพาะไฟล์ที่เป็น image
//     if (!file.mimetype.startsWith('image/')) {
//       return cb(new Error('ไฟล์ที่อัปโหลดต้องเป็นรูปภาพเท่านั้น!'), false);
//     }
//     cb(null, true);
//   }
// }).single('profileImage');


const editProfile = async (req, res) => {
  try {
    // const userId = req.session.userId;
    let user = await User.findById('65a57db82f095952332b383e');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    if (req.file) {
      const img = req.file.filename;
      user.fname = req.body.fname || user.fname;
      user.lname = req.body.lname || user.lname;
      user.nickname = req.body.nickname || user.nickname;
      user.notes = req.body.notes || user.notes;
      user.img = img;
      await user.save();
    } else if (!req.file) {
      user.fname = req.body.fname || user.fname;
      user.lname = req.body.lname || user.lname;
      user.nickname = req.body.nickname || user.nickname;
      user.notes = req.body.notes || user.notes;
      await user.save();
    }

    res.redirect('/profile');

    // res.json(req.file);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
}
//   if (req.session.userId) {
//     // ใช้ multer สำหรับการอัปโหลดไฟล์
//     imgUpload.single('img')(req, res, async function (err) {  // ใช้ 'single' สำหรับอัปโหลดรูปโปรไฟล์เดียว
//       if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
//         return res.status(400).json({ message: 'ไฟล์ขนาดเกินขนาดที่กำหนด (สูงสุด 50MB)' });
//       } else if (err) {
//         return res.status(400).json({ message: err.message });
//       }

//       try {
//         const userId = req.session.userId;
//         let user = await User.findById(userId);

//         if (!user) {
//           return res.status(404).json({ message: 'User not found' });
//         }


//         var imgUrl = "";
//         if (req.file) {
//           var imgUrl = `/uploads/${req.file.filename}`;
//           req.body.img = imgUrl;
//           user.img = req.body.img || user.img;
//         }

//         // อัปเดตข้อมูลอื่นๆ ของผู้ใช้
//         user.fname = req.body.fname || user.fname;
//         user.lname = req.body.lname || user.lname;
//         user.nickname = req.body.nickname || user.nickname;
//         user.notes = req.body.notes || user.notes;


//         await user.save();

//         res.redirect('/profile');
//       } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
//       }
//       //ถ้าstudentไปprofileStudent.ejs ถ้าteacherไปprofileTeacher
//     });
//   } else {
//     res.redirect('/');
//   }
// };



module.exports = { profileIndex, editProfile };
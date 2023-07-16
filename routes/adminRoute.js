const router = require('express').Router();
const controller = require('../controllers/userController');
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./publics/uploads");
  },
  filename: function (req, file, cb) {
    const arr = file.originalname.split(".");
    const ext = arr[arr.length - 1];
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + `.${ext}`);
  },
});
const upload = multer({ storage: storage });
router.get('/profile',controller.getProfile)
router.post('/changStatus', controller.changeStatus)
// lấyy user về và phân trang
router.get('/getAllUsers', controller.getAllUsers)
router.get('/findUserByName/:username', controller.getFindUserByNameUser)
router.get('/paginationUsers', controller.getPaginationUsers)
// thay đổi thông tin thì sẽ reload lại trang
router.post('/changeProfile',upload.single('avatar'), controller.changeProfile)
// đổi password thì logout yêu cầu đăng nhập lại
router.post('/changePassword', controller.changePassword)
module.exports = router;
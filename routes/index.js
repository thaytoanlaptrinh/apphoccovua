const router = require('express').Router();
const path = require('path');
const passport = require('passport');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './views/uploads')
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + ext)
    }
})

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.includes('image')) {
            cb(null, true)
        } else {
            cb(new Error('Only Image'))
        }
    }
})



const { checkRole, checkLogin, checkToken } = require('../middleware/auth');

const { indexController } = require('../controllers/indexController');
const { loginGetController } = require('../controllers/loginController');
const { loginPostController } = require('../controllers/loginController');
const { covuaquandoiController } = require('../controllers/covuaquandoiController');
const { playController } = require('../controllers/playController');
const { homeController } = require('../controllers/homeController');
const { registerGetController } = require('../controllers/registerController');
const { registerPostController } = require('../controllers/registerController');
const { adminController } = require('../controllers/adminController');
const { uploadPostController, uploadController, uploadCmtPostController } = require('../controllers/uploadController');
const { troChuyenController } = require('../controllers/troChuyen');

router.get('/login', loginGetController);
router.get('/puzzles', loginGetController);
router.get('/trochuyen', troChuyenController);
router.get('/admin', checkToken, checkRole, adminController);
router.post('/login', loginPostController);
router.get('/covuaquandoi', covuaquandoiController);
router.get('/play', checkToken, playController);
router.get('/register', registerGetController);
router.post('/register', registerPostController);
router.get('/home', homeController);
router.post('/upload', upload.single('avatar'), uploadPostController);
router.post('/uploadcmt', upload.array('cmt'), uploadCmtPostController);
router.get('/upload', uploadController);
router.get('/auth/google', passport.authenticate('google'));
router.get('/google/login', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
}))
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] })
)
router.get('/facebook/loged',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/')
    })

router.get('/auth/apple', passport.authenticate('apple', { scope: ['email', 'public_profile'] })
)


router.get('/', indexController);
module.exports = router;
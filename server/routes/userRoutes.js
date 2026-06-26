const router = require('express').Router();
const multer = require('multer');
const { getAllUsers, getUserById, updateUser, updateAvatar, deleteUser, getInstructors, getStudents, createUser, getMyInstructor } = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(file.mimetype.split('/')[1]);
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image files (jpg, png, gif, webp) are allowed'));
  }
});

router.get('/', auth, getAllUsers);
router.post('/', auth, authorize('admin'), createUser);
router.get('/instructors', auth, getInstructors);
router.get('/students', auth, getStudents);
router.get('/my-instructor', auth, authorize('student'), getMyInstructor);
router.get('/:id', auth, getUserById);
router.put('/:id/avatar', auth, upload.single('avatar'), updateAvatar);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, authorize('admin'), deleteUser);

module.exports = router;

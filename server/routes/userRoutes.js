const router = require('express').Router();
const multer = require('multer');
const { getAllUsers, getUserById, updateUser, deleteUser, getInstructors, getStudents, createUser, getMyInstructor } = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
});

router.get('/', auth, getAllUsers);
router.post('/', auth, authorize('admin'), createUser);
router.get('/instructors', auth, getInstructors);
router.get('/students', auth, getStudents);
router.get('/my-instructor', auth, authorize('student'), getMyInstructor);
router.get('/:id', auth, getUserById);
router.put('/:id/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const User = require('../models/User');
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { avatar: base64 },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ message: error.message });
  }
});
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, authorize('admin'), deleteUser);

module.exports = router;

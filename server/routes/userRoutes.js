const router = require('express').Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { getAllUsers, getUserById, updateUser, deleteUser, getInstructors, getStudents, createUser, getMyInstructor } = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');
const { cloudinary } = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'najah/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const upload = multer({ storage });

router.get('/', auth, getAllUsers);
router.post('/', auth, authorize('admin'), createUser);
router.get('/instructors', auth, getInstructors);
router.get('/students', auth, getStudents);
router.get('/my-instructor', auth, authorize('student'), getMyInstructor);
router.get('/:id', auth, getUserById);
router.put('/:id/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    const User = require('../models/User');
    const avatarUrl = req.file.path;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { avatar: avatarUrl },
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

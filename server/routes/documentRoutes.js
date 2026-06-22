const router = require('express').Router();
const multer = require('multer');
const { uploadDocument, getDocsByProject, deleteDocument } = require('../controllers/documentController');
const { auth } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/', auth, upload.single('file'), uploadDocument);
router.get('/project/:projectId', auth, getDocsByProject);
router.delete('/:id', auth, deleteDocument);

module.exports = router;
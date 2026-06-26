const router = require('express').Router();
const multer = require('multer');
const { uploadDocument, getDocsByProject, deleteDocument } = require('../controllers/documentController');
const { auth } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', auth, upload.single('file'), uploadDocument);
router.get('/project/:projectId', auth, getDocsByProject);
router.delete('/:id', auth, deleteDocument);

module.exports = router;

const router = require('express').Router();
const { createProject, getAllProjects, getProjectById, updateProject, deleteProject, updateStatus, updateProgress } = require('../controllers/projectController');
const { auth } = require('../middleware/auth');

router.post('/', auth, createProject);
router.get('/', auth, getAllProjects);
router.get('/:id', auth, getProjectById);
router.put('/:id', auth, updateProject);
router.delete('/:id', auth, deleteProject);
router.patch('/:id/status', auth, updateStatus);
router.patch('/:id/progress', auth, updateProgress);

module.exports = router;
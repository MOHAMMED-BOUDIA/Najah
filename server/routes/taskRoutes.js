const router = require('express').Router();
const { createTask, getAllTasks, getTasksByProject, updateTask, updateTaskStatus, deleteTask } = require('../controllers/taskController');
const { auth } = require('../middleware/auth');

router.get('/', auth, getAllTasks);
router.post('/', auth, createTask);
router.get('/project/:projectId', auth, getTasksByProject);
router.put('/:id', auth, updateTask);
router.patch('/:id/status', auth, updateTaskStatus);
router.delete('/:id', auth, deleteTask);

module.exports = router;
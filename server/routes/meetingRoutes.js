const router = require('express').Router();
const { createMeeting, getMeetingsByProject, updateMeeting, deleteMeeting } = require('../controllers/meetingController');
const { auth } = require('../middleware/auth');

router.post('/', auth, createMeeting);
router.get('/project/:projectId', auth, getMeetingsByProject);
router.put('/:id', auth, updateMeeting);
router.delete('/:id', auth, deleteMeeting);

module.exports = router;
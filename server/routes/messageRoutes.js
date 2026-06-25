const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { getMessages, sendMessage } = require('../controllers/messageController');

router.get('/group/:groupId', auth, getMessages);
router.post('/', auth, sendMessage);

module.exports = router;

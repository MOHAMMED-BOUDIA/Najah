const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { getMessages, sendMessage, deleteMessage } = require('../controllers/messageController');

router.get('/group/:groupId', auth, getMessages);
router.post('/', auth, sendMessage);
router.delete('/:id', auth, deleteMessage);

module.exports = router;

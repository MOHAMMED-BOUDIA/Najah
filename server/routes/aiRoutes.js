const router = require('express').Router();
const { chat, testKey } = require('../controllers/aiController');
const { auth } = require('../middleware/auth');

router.post('/chat', auth, chat);
router.get('/test', auth, testKey);

module.exports = router;

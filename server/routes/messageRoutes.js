const { sendMessage, getMessages, getConversations } = require('../controllers/messageController');
const protectRoute = require('../middlewares/protectRoute');

const router = require('express').Router() ;

router.get('/conversations', protectRoute, getConversations)
router.get('/:otherUserId', protectRoute, getMessages)
router.post('/', protectRoute,sendMessage)



module.exports = router ;
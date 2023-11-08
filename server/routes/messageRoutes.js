const { sendMessage } = require('../controllers/messageController');
const protectRoute = require('../middlewares/protectRoute');

const router = require('express').Router() ;

router.post('/', protectRoute,sendMessage)



module.exports = router ;
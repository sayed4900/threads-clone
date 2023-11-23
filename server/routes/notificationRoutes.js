const router = require('express').Router(); 
const protectRoute = require('../middlewares/protectRoute')
const {getNotifications,getMessagesNotifications, markNotiticationAsSeen, deleteNotifiction} = require('../controllers/notificationController') ;


router.get('/',protectRoute, getNotifications);
router.get('/message-notification',protectRoute, getMessagesNotifications);
router.put('/:id',protectRoute, markNotiticationAsSeen);
router.delete('/:id',protectRoute, deleteNotifiction);


module.exports = router ;
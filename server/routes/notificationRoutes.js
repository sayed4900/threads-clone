const router = require('express').Router(); 
const protectRoute = require('../middlewares/protectRoute')
const {getNotifications} = require('../controllers/notificationController') ;


router.get('/',protectRoute, getNotifications);


module.exports = router ;
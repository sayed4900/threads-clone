const router = require('express').Router();
const {signupUser, loginUser, logoutUser, followUnfollowUser} = require('../controllers/userController')
const protectRoute = require('../middlewares/protectRoute');

router.get('/logout', logoutUser);
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/follow/:id', protectRoute, followUnfollowUser);

//login
// update profile
// follow

module.exports = router ;
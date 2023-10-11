const router = require('express').Router();
const {signupUser, loginUser, logoutUser, updateUser, followUnfollowUser, getUserProfile} = require('../controllers/userController')
const protectRoute = require('../middlewares/protectRoute');

router.get('/profile/:username', getUserProfile)
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/follow/:id', protectRoute, followUnfollowUser);
router.post('/update/:id', protectRoute, updateUser);

//login
// update profile
// follow

module.exports = router ;
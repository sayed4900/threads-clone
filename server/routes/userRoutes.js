const upload = require('../middlewares/multer');
const router = require('express').Router();
const {signupUser, loginUser, logoutUser, updateUser, followUnfollowUser, getUserProfile} = require('../controllers/userController')
const protectRoute = require('../middlewares/protectRoute');

router.get('/profile/:query', getUserProfile)
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/follow/:id', protectRoute, followUnfollowUser);
router.put('/update/:id', protectRoute, upload.single('file'), updateUser);

//login
// update profile
// follow

module.exports = router ;
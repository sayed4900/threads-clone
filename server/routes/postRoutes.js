const router = require('express').Router(); 
const protectRoute = require('../middlewares/protectRoute')

const {createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts} = require('../controllers/postController')

router.get('/feed',protectRoute, getFeedPosts)
router.get('/:id', getPost)
router.post('/create', protectRoute, createPost)
router.put('/like/:id', protectRoute, likeUnlikePost)
router.put('/replay/:id', protectRoute, replyToPost)
router.delete('/delete/:id', protectRoute, deletePost)

module.exports = router ;
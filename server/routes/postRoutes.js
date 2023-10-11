const router = require('express').Router(); 
const protectRoute = require('../middlewares/protectRoute')

const {createPost, getPost, deletePost} = require('../controllers/postController')

router.get('/:id', getPost)
router.post('/create', protectRoute, createPost)
router.delete('/delete/:id', protectRoute, deletePost)

module.exports = router ;
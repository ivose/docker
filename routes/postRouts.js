const express = require('express');
const pc = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');//protect
const router = express.Router();

router.route('/')
    .get(authMiddleware, pc.getAllPosts)
    .post(authMiddleware, pc.createPost);

router.route('/:id')
    .get(authMiddleware, pc.getOnePost)
    .patch(authMiddleware, pc.updatePost)
    .delete(authMiddleware, pc.deletePost);

module.exports = router;
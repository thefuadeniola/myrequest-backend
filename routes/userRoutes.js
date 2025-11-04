import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { registerUser, login, fetchMe, logout } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser)

router.post('/login', login)

router.get('/me', protect, fetchMe)

router.post('/logout', logout)

/* // Get single post
router.get('/:id', getPost);

// create new post
router.post('/', newPost);

// Update post
router.put('/:id', updatePost);

// Delete Post
router.delete('/:id', deletePost);
 */
export default router;
import express from 'express';
import Admin from '../models/admin.js';
import generateToken from '../utils/generateToken.js';

const router = express.Router();

router.post('/register', async(req, res, next) => {
    try {
        const { username, password } = req.body;

        const adminExists = await Admin.findOne({ username })
        if(adminExists) return res.status(400).json({ message: "Admin already exists" })
        
        const admin = await Admin.create({ username, password });

        res.status(201).json({
            _id: admin._id,
            username: admin.username,
            token: generateToken({adminId: admin._id})
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/login', async(req, res, next) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username })

        if(admin && (await admin.matchPassword(password))) {
            res.status(200).json({
                _id: admin.id,
                username: admin.username,
                token: generateToken({adminId: admin._id})
            })
        } else {
            res.status(401).json({ message: "Invalid username or password" })
        }
    } catch (error) {
        res.status(500).json({ message: `Unable to login: ${error.message}` })
    }
})

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
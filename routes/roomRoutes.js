import express from 'express';
import Room from '../models/room.js';
import protect from '../middleware/authMiddleware.js';
import generateToken from '../utils/generateToken.js';
import protectRoom from '../middleware/roomMiddleware.js';
import Admin from '../models/admin.js';

const router = express.Router();

router.post('/create', protect, async(req, res, next) => {
    try {
        const { name, pin, image } = req.body;

        const room = await Room.create({
            name, pin, image, admin: req.admin._id
        });

        res.status(201).json(room)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/enter', async(req, res, next) => {
    const { name, pin } = req.body;
    const room = await Room.findOne({ name }).populate("admin", "username")

    try {
        if(await room.matchPin(pin)) {
            res.status(200).json({
                _id: room.id,
                name: room.name,
                adminUsername: room.admin.username,
                token: generateToken({roomId: room._id}),
            })
        } else res.status(401).json({ message: "Invalid room pin!" })
    } catch (error) {
        res.status(500).json({ message: `Unable to enter room` })
    }
})

router.get('/all', async (req, res, next) => {
    try {
        const rooms = await Room.find({});
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:userId/:roomId", async (req, res) => {
  try {
    const { userId, roomId } = req.params;

    const admin = await Admin.findById(userId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const room = await Room.findById(roomId).populate("admin", "username");
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.admin._id.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to access this room" });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/add-request', protectRoom, async(req, res, next) => {
    try {
        const {title, artistes} = req.body;
        const room = await Room.findById(req.room._id);

        if(!room) {
            return res.status(404).json({ message: "Room not found" })
        }

        room.requests.push({
            song_title: title,
            artistes: [...artistes]
        })

        await room.save();
        
        res.status(201).json(room.requests[room.requests.length - 1])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export default router;
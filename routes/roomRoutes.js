import express from 'express';
import protect from '../middleware/authMiddleware.js';
import protectRoom from '../middleware/roomMiddleware.js';
import { addRequest, createRoom, enterRoom, fetchAllRooms, fetchSingleRoom } from '../controllers/roomController.js';
const router = express.Router();

// create a room
router.post('/create', protect, createRoom)

// enter a room using the pin
router.post('/enter', enterRoom)

// fetch all rooms
router.get('/all', fetchAllRooms);

// fetch single room
router.get("/:roomId", protectRoom, fetchSingleRoom);

// add a request inside a room
router.post('/add-request', protectRoom, addRequest)

export default router;
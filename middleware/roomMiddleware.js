import jwt from "jsonwebtoken";
import Room from "../models/room.js";

const protectRoom = async(req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.room = await Room.findById(decoded.roomId)
            next();
        } catch (error) {
            res.status(401).json({ message: "Room token authorization failed" })
        }
    }

    if(!token) {
        res.status(401).json({ message: "Not authorized, no room token" })
    }
}

export default protectRoom;
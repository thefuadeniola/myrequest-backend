import Admin from "../models/admin.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async(req, res, next) => {
    try {
        const { username, password } = req.body;

        const adminExists = await Admin.findOne({ username })
        if(adminExists) return res.status(400).json({ message: "Admin already exists" })
        
        const admin = await Admin.create({ username, password });

        const accessToken = generateToken({ adminId: admin._id })
        
        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        res.status(201).json({
            _id: admin._id,
            username: admin.username,
            token: accessToken
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const login = async(req, res, next) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username })

        if(admin && (await admin.matchPassword(password))) {

            const accessToken = generateToken({adminId: admin._id})

            res.cookie("access_token", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            });
            res.status(200).json({
                _id: admin.id,
                username: admin.username,
                token: accessToken
            })
        } else {
            res.status(401).json({ message: "Invalid username or password" })
        }
    } catch (error) {
        res.status(500).json({ message: `Unable to login: ${error.message}` })
    }
}

export const fetchMe = async(req, res) => {
    const { username } = req.admin;
    if(username) {
        res.status(200).json({ username })
    } else {
        res.status(401).json({ message: "Not logged in" })
    }
}

export const logout = (req, res) => {
    console.log("logging out...")
    res.clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path:"/"
    })

    res.status(200).json({ message: "Logged out successfully" })
}
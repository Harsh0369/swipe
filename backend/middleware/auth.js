import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
    try {
            const token = req.cookies.jwt;
            if(!token) {
                return res.status(401).json({ message: "You need to be logged in to access this route" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const currentUser = await User.findById(decoded.id);
        req.user = currentUser;
        next();
    } catch (error) {
        console.log("error in protectRoute middleware: ", error);
        res.status(500).json({ message: error.message });
} 
}
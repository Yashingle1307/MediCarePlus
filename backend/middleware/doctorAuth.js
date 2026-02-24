import jwt from 'jsonwebtoken';
import Doctor from '../models/doctor.js';
const JWT_SECRET = process.env.JWT_SECRET;

export default async function doctorAuth(req, res, next) {

    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }
    const token = authHeader.split(" ")[1];
    try {
        // verify token
        const payload = jwt.verify(token, JWT_SECRET);

        if (payload.role !== "doctor")
            return res.status(401).json({ message: "Access denied. You are not authorized as a doctor." });

        const doctor = await Doctor.findById(payload.id).select("-password");

        if (!doctor) {
            return res.status(401).json({ message: "Doctor not found." });
        }
        req.doctor = doctor; // attach doctor info to request
        next();
    }
    catch (err) {
    console.error("Doctor authentication error:", err);
    return res.status(401).json({ message: "Invalid or expired token." });
}
}
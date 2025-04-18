import jwt from "jsonwebtoken";

export const generateToken = (userId, res, days = 3) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: `${days}d`
    });

    res.cookie("jwt", token, {
        maxAge: days * 24 * 60 * 60 * 1000, // Convert days to milliseconds
        httpOnly: true,
        sameSite: "lax", // Ensures cookie is sent with same-site requests
        secure: process.env.NODE_ENV === "production" // Secure only in production
    });

    return token;
};


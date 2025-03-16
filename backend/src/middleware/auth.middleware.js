import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req , res , next)=>{
    try {
        const token = await req.cookies.jwt;
        
        //checking if the token exists or not in the cookies
        if(!token){
            return res.status(400).json({message: "Unauthorized , no token provided."});
        }

        //decoding the token and checking if it matches or not
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        //if the token does not match and not decoded
        if(!decodedToken){
            return res.status(400).json({message: "Unauthorized , invalid token"});
        }

        const user = await User.findById(decodedToken.userId).select("-password");

        //last check if the user is not found in any case

        if(!user){
            return res.status(400).json({message: "User not found"});
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Some error occured in the protectRoute middleware" + error.message)
        res.status(500).json({message: "Internal Server Error"})
    }
}
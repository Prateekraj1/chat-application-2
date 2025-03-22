import mongoose, { mongo } from "mongoose";

//function for connecting the database using mongoose
export const connectDB = async() =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.log("MongoDB Connection Error : " + error)
    }
} 
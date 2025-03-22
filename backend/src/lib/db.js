import mongoose, { mongo } from "mongoose";

//function for connecting the database using mongoose
export const connectDB = async() =>{
    try {

    console.log("The app is listening on the port " + process.env.MONGO_URI);
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`mongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.log("MongoDB Connection Error : " + error)
    }
} 
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.route.js'
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import { app , server } from './lib/socketio.js';

dotenv.config();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use("/api/auth" , authRoutes);
app.use("/api/message" , messageRoutes)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../front-end/dist")));

    app.get("*" , ( req,res ) => {
        res.sendFile(path.join(__dirname , "../front-end" , "dist" , "index.html"))
    })
}

server.listen(PORT , ()=>{
    console.log("The app is listening on the port " + PORT);
    connectDB();
})
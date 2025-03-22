import {Server} from 'socket.io';
import http from 'http';

import express from 'express';


const app = express();
const server = http.createServer(app);

const io = new Server(server , {
    cors:{
        origin : [process.env.FRONTEND_URL]
    }
})


const userSocketMap = {};

//will take userId and return socketid
export function getReceiverSocketId (userId) {
    return userSocketMap[userId];
}


io.on("connection", (socket)=>{ 

    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id;

    //this is used to send or broadcasts the event to all connected clients
    io.emit("getOnlineUsers" , Object.keys(userSocketMap));
    
    socket.on("disconnect" , ()=>{
        delete userSocketMap[userId];
        io.emit("getOnlineUsers" , Object.keys(userSocketMap));
    })
})

export {io , server , app};
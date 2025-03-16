import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId , io} from "../lib/socketio.js";
import Message from "../models/message.model.js"

export const getMessages = async (req , res) =>{
    try {
        //pulling the id of the user with whom i want to chat
        const {id:userToChatId} = req.params

        //current id
        const myId = req.user._id;

        //filtering the messages where either the sender is me or the receiver is me
        const messages = await Message.find({
            $or:[
                {senderId: myId , receiverId: userToChatId},
                {senderId: userToChatId , receiverId: myId}
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.log("Some error occured in the getMessages controller")
        res.status(500).json({message: "Internal Server Error"})
    }
}

export const sendMessage = async (req , res) =>{
    try {
        const { text , image } = req.body;
        
        //pulling the id of the user i want to send message to
        const { id:receiverId } = req.params;

        //my id
        const senderId = req.user._id;

        // receiverId = new mongoose.Types.ObjectId(receiverId);

        //keeping the imageurl undefined at first and when the message type is image , we'll get our imageUrl from cloudinary
        let imageUrl;

        if(image){
            //uploading the image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            //getting the url
            imageUrl = uploadResponse.secure_url;
        }

        //our new message
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        await newMessage.save();

        // implementing it in the real time using socket.io

        const receiverSocketId = getReceiverSocketId(receiverId);

        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage" , newMessage)
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Some error occured in the sendMessage controller" + error);
        res.status(500).json({message: "Internal Server Error"})
    }
}
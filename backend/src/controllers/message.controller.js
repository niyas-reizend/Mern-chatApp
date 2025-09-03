import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";


// to get the users to list in the sidebar 
export const getUsersForSidebar = async(req , res, next)=>{
    try{
        const loggedInUserId = req.user._id;
        const filterdUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        return res.status(200).json({message:"users for sidebar",filterdUsers});

    }catch(error){
        next(error);
    }
}

// to get the messages inside the chat 
export  const getMessages =  async(req, res, next) =>{
    try{
        const {id:userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        })
        res.status(200).json({
            success:true,
            message:"fetched the messages",
            messages
        })
         
    }catch(error){
        next(error)
    }
}


// to send the message 
export const sendMessage = async(req, res, next)=>{
    try{
        const {text,image} = req.body;
        const{id:receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId:senderId,
            receiverId:receiverId,
            text:text,
            image:imageUrl,
        })

        await newMessage.save();

        // to do later : implementation of the socket.io goes here

         return res.status(201).json(newMessage);


    }catch(error){
        next(error);
    }

}
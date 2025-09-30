import Message from "../models/message.js"
import User from "../models/user.js"
import cloudinary from '../lib/cloudinary.js'
import { io,userSocketMap } from "../server.js"


export const getAllUsersForSidebar=async(req, res)=>{
    try {
        const userId=req.user._id
        const filterUser=await User.find({_id:{$ne:userId}}).select("-password")

        //count unseen message

        const unseenMessage={}

        const promises=filterUser.map(async(user)=>{
            const message=await Message.find({senderId:user._id, reciverId:userId, seen:false})
            if(message.length > 0){
                unseenMessage[user._id]=message.length
            }
        })

        await Promise.all(promises)

        res.json({success:true,users:filterUser,unseenMessage})
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
        
    }
}

//get all the message for selected user

export const getMessage=async(req,res)=>{
    try {
        const {id:selectedUserId}=req.params;
        const myId=req.user._id

        const message=await Message.find({
            $or:[
                {senderId:myId,reciverId:selectedUserId},
                {senderId:selectedUserId,reciverId:myId},
            ] 
        })

        await Message.updateMany({senderId:selectedUserId, reciverId:myId},{seen:true})

        res.json({success:true,message})
    } catch (error) {
         console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

//api to mark message as seen

export const markMessageSeen=async(req, res)=>{
        try {
            const {id}=req.params

            await Message.findByIdAndUpdate(id,{seen:true})
            res.json({success:true})
        } catch (error) {
            console.log(error.message);
            res.json({success:false,message:error.message})
        }
}

//controller for a new message

export const sendMessage=async(req, res)=>{
    try {
        const {text,image}=req.body
        const reciverId=req.params.id
        const senderId=req.user._id

        let imageUrl;

        if(image){
            const uploadResponse=  await cloudinary.uploader.upload(image)
            imageUrl=uploadResponse.secure_url
        }

        const newMessage=await Message.create({
            senderId,
            reciverId,
            text,
            image:imageUrl
        })

        //emit message to a conncted user

        const reciverSocketId=userSocketMap[reciverId]
        if(reciverSocketId){
            io.to(reciverSocketId).emit("newMessage",newMessage)
        }

        res.json({success:true,newMessage})

    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}
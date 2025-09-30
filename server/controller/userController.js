import { generateToken } from "../lib/utils.js"
import User from "../models/user.js"
import bcrypt from 'bcryptjs'
import cloudinary from '../lib/cloudinary.js'


//sign up controller->


export const signup=async(req,res)=>{
    const {fullName, email, password, bio}=req.body
    try {

        if(!fullName || !email || !password || !bio){
            return res.json({success:false, message:"missing details"})
        }

        const user=User.findOne({email})

        if(user){
            return res.json({success:false, message:"account already exist"})
        }

        const salt= await bcrypt.genSalt(10)    
        const hashPassword=await bcrypt.hash(password,salt)

        const new_user= await User.create({
            fullName,email,password:hashPassword,bio
        })

        const token=generateToken(new_user._id)

        res.json({success:true, userData:new_user,token,message:"account created successfully"})

    } catch (error) {
        console.log(error.message);
         res.json({success:true, message:error.message})
        
    }
}

// controller to login user

export const login=async(req,res)=>{
    
    try {
        const {email,password}=req.body
        const userData=await User.findOne({email})

        const isPasswordCorrect=await bcrypt.compare(password,userData.password)
        if(!isPasswordCorrect){
            return res.json({success:false,message:"invalid creditainls"})
        }

        const token=generateToken(userData._id)

        res.json({success:true,userData,token,message:"login successfully"})
        
    } catch (error) {
        console.log(error.message);
        res.json({success:true,userData,token,message:error.message})
        
    }
}

//controller to check if user is authenticated

export const checkAuth=async(req, res)=>{
    res.json({success:true,user:req.user})
}


//controller to update user profile details

export const updateProfile=async(req, res)=>{
    try {
        const {profilePic, bio, fullName}=req.body

        const userId=req.user._id
        let updatedUser;

        if(!profilePic){
          updatedUser=await User.findByIdAndUpdate(userId,{bio, fullName},{new:true})  
        }else{
            const uplaod=await cloudinary.uploader.uplaod(profilePic)
            updatedUser=await User.findByIdAndUpdate(userId,{profilePic:uplaod.secure_url, bio, fullName},{new:true})
        }

        res.json({success:true, user:updatedUser})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
        
    }
}
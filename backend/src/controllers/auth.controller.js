// import ApiError from "../utils/ApiError";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { generateTokens } from "../utils/genrateTokens.js";
import mongoose from "mongoose";
import cloudinary from "../utils/cloudinary.js";


// user signup 
export const handleSignup = async (req, res,next) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
    throw new ApiError("All feilds are required",400)
    }

    if (password.length < 6) {
        throw new ApiError("Password must be atleast 6 character",400)
    }

    const user = await User.findOne({ email: email });
    if (user){
        throw new ApiError("Email already exists",400)
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword,
    });

    await newUser.save();

    return res
      .status(200)
      .json({ 
        success:true,
        message: "User Created Successfully", newUser });

    // if(newUser){
    //     generateTokens(newUser._id,res)
    //     await newUser.save()

    //     res.status(201).json({
    //         _id:newUser._id,
    //         fullName:newUser.fullName,
    //         email:newUser.email,
    //         profilePic:newUser.profilePic
    //     })
    // }else{
    //     throw new ApiError("Invalid User Data",400)

    // }
  } catch (error) {
    next(error);
  }
};

// user login 
export const handleLogin = async (req, res,next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!email || !password) {
    throw new ApiError("All feilds are Required",400)
    }
    if (!user) {
    throw new ApiError("User Not Found",400)
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
    throw new ApiError("Invalid Password",400)
    }
    const userPayload = {_id:user._id}

    const token = generateTokens(userPayload, res);

    res.status(200).json({
      success:true,
      message: "Login Successfull",
      user: user._id,
      email: user.email,
      token: token,
    });
  } catch (error) {
    next(error)
  }
};

// user logout 
export const handleLogout = async(req, res, next) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ success: true,message: "Logged Out Successfully" });
  } catch (error) {
    console.log("Error in logout controller",error.message);
    
    next(error);
  }
};

// user profile update 
export const handleUpdateProfile = async(req,res)=>{
    try{
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic){
            throw new ApiError("Profile pic is required",400)
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true}) // new: true is given to get the updated user as the response

        res.status(200).json({success:true,message:"Profile updated Successfully",updatedUser})

    }catch(error){
        next(err);

    }

}


// to handle the authenticate check
export const handleCheckAuth = async(req,res, next)=>{
    try{
        res.status(200).json(req.user);
    }catch(error){
        console.log("Error in useAuth controller", error.message);
        res.status(500).json({message:"Internal server Error"})
        
    }
}
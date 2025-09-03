import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

export const authenticate = async (req,res,next)=>{
    try{
        const token = req.cookies.token;
        
        if(!token){
            throw new ApiError("Unathorized-Token not Provided",401);
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            throw new ApiError("Unathorized- Invalid Token",401);
        }
        
        const user = await User.findOne({_id:decoded._id});
        if(!user){
            throw new ApiError("User not found ",404);
        }

        req.user = user;

        next()

    }catch(error){

        next(error)
    }

}
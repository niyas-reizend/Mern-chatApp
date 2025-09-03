import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async()=>{
    try{

        const uri = process.env.MONGODB_URL
       const conn = await mongoose.connect(uri)
       console.log(`MongoDb conneceted ${conn.connection.host}`);
    }catch(error){
        console.log("MongoDb connection Error ",error);
    }
};

export default connectDB;
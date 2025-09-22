import mongoose from "mongoose";

export const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI!);
        const connection = mongoose.connection;
        connection.on("connected",()=>{
            console.log("MongoDB connected ✅");
        })
        connection.on("error",(err)=>{
            console.log("MongoDB connection error ❌");
            console.log(err);
            process.exit();
        })
    }
    catch(err){
        console.log("Error in DB connection");
        console.log(err);
    }
}
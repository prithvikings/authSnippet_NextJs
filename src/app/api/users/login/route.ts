import {connectDB} from "@/dbConfig/dbconfig";
import bcryptjs from "bcryptjs";
import User from "@/models/user.model";
import {NextResponse,NextRequest} from "next/server";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(request:NextRequest){
    try{
        const reqBody=await request.json();
        const {email,password}=reqBody;

        //validation we will use in future
        const user=await User.findOne({
            email:email
        })

        if(!user){
            return NextResponse.json({message:"User does not exist"},{status:400});
        }

        //compare password
        const isMatch=await bcryptjs.compare(password,user.password);
        if(!isMatch){
            return NextResponse.json({message:"Invalid credentials"},{status:400});
        }
        //check if user is verified
        if(!user.isVerified){
            return NextResponse.json({message:"Please verify your email to login"},{status:400});
        }

        //generate jwt token
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET_KEY as string,{expiresIn:"1d"});

        const response=NextResponse.json({message:"Login successful",user:{
            id:user._id,
            name:user.name,
            email:user.email,
            isVerified:user.isVerified
        }},{status:200});

        //set cookie
        response.cookies.set("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:"strict",
            maxAge:24*60*60, //1 day
        });

        return response;

    }catch(error:any){
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}
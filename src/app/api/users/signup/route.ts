import {connectDB} from "@/dbConfig/dbconfig";
import bcryptjs from "bcryptjs";
import User from "@/models/user.model";
import {NextResponse,NextRequest} from "next/server";
import { sendEmail } from "@/helpers/mailer";
connectDB();

export async function POST(request:NextRequest){
    try{
        const reqBody=await request.json();
        const {username,email,password}=reqBody;
        //validation we will use in future
        const userExists=await User.findOne({email:email});
        if(userExists){
            return NextResponse.json({message:"User already exists"},{status:400});
        }
        const hashedPassword=await bcryptjs.hash(password,10);
        //create user
        const newUser=new User({
            username:username,
            email:email,
            password:hashedPassword
        })
        const saveduser=await newUser.save();
        console.log("User created successfully",saveduser);

        //Now we have to send verification email to user
        if(saveduser){
            await sendEmail({email:saveduser.email,emailtype:"VERIFY",userId:saveduser._id.toString()});
            return NextResponse.json({message:"User created successfully, Please verify your email",user:saveduser},{status:201});
        }else{
            return NextResponse.json({message:"User not created"},{status:400});
        }
    }catch(error){
        return NextResponse.json({message:error},{status:500});
    }
}
export async function GET(request:NextRequest){}
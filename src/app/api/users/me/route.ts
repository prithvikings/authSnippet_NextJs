import {connectDB} from "@/dbConfig/dbconfig";
import User from "@/models/user.model";
import {NextResponse,NextRequest} from "next/server";
import jwt from "jsonwebtoken";

connectDB();

export async function GET(request:NextRequest){
   try{
      const token = request.cookies.get("token")?.value;
      if(!token){
         return NextResponse.json({message:"Unauthorized",success:false},{status:401});
      }
      //verify token
      const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY as string) as {id:string};
      const user=await User.findById(decoded.id).select("-password");
      if(!user){
         return NextResponse.json({message:"User not found",success:false},{status:404});
      }
      return NextResponse.json({message:"User fetched successfully",success:true,user},{status:200});
   }
   catch(error){
      return NextResponse.json({message:"Internal Server Error",error}, {status:500});
   }
}
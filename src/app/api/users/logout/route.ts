import {connectDB} from "@/dbConfig/dbconfig";
import {NextResponse,NextRequest} from "next/server";

connectDB();

export async function GET(request:NextRequest){
    try{
        const user = request.cookies.get("token");
        if(!user){
            return NextResponse.json({error:"You are already logged out",success:false},{status:401});
        }
        const response = NextResponse.json({message:"Logged out successfully",success:true},{status:200});
        response.cookies.set("token","",{
            httpOnly:true,
            secure:true,
            sameSite:"strict",
            maxAge:0,
        });
        return response;
    }catch(error){
        console.log(error);
        return NextResponse.json({error:"Internal Server Error",message:error}, {status:500});
    }
}
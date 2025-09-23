// /api/users/forgotpassword/route.ts
import { NextResponse } from "next/server";
import User from "@/models/user.model";
import { connectDB } from "@/dbConfig/dbconfig";
import crypto from "crypto";

connectDB();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    user.forgotPasswordToken = token;
    user.forgotPasswordExpiry = Date.now() + 1000 * 60 * 15; // 15 min expiry
    await user.save();

    // send reset link (for now console log)
    const resetLink = `${process.env.NEXT_PUBLIC_HOST}/resetpassword/${token}`;
    console.log("Reset Link:", resetLink);

    return NextResponse.json({ message: "Reset link sent to email" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import User from "@/models/user.model";
import { connectDB } from "@/dbConfig/dbconfig";
import bcrypt from "bcryptjs";

connectDB();

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ message: "Token and password are required" }, { status: 400 });
    }

    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordExpiry: { $gt: Date.now() }, // ensure not expired
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.forgotPasswordToken = null;
    user.forgotPasswordExpiry = null;

    await user.save();

    return NextResponse.json({ message: "Password reset successful" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

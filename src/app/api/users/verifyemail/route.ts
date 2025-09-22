import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/models/user.model";
import { connectDB } from "@/dbConfig/dbconfig";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;

    if (!token) {
      return NextResponse.json({ message: "Token missing" }, { status: 400 });
    }

    // hash the token for DB lookup
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      verifytoken: hashedToken,
      verifytokenexpiry: { $gt: Date.now() }, // check expiry
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    user.isVerified = true;
    user.verifytoken = undefined;
    user.verifytokenexpiry = undefined;
    await user.save();

    return NextResponse.json({ message: "Email verified successfully!" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

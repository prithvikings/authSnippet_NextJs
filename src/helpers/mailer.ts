import User from "@/models/user.model";
import nodemailer from "nodemailer";
import crypto from "crypto";
import mongoose from "mongoose";

export const sendEmail = async ({
  email,
  emailtype,
  userId,
}: {
  email: string;
  emailtype: string;
  userId: string;
}) => {
  try {
    console.log("Sending email to:", email, "of type:", emailtype, "for userId:", userId);

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    console.log("Generated token:", token);
    console.log("Hashed token:", hashedToken);

    // ensure userId is an ObjectId
    const objectId = new mongoose.Types.ObjectId(userId);

    if (emailtype === "VERIFY") {
      const res = await User.updateOne(
        { _id: objectId },
        { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 }
      );
      console.log("Update result:", res);
    } else if (emailtype === "RESET") {
      await User.updateOne(
        { _id: objectId },
        { forgotPasswordToken: hashedToken, forgotPasswordExpiry: Date.now() + 3600000 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: { user: process.env.MAIL_USER!, pass: process.env.MAIL_PASS! },
    });

    const url =
      emailtype === "VERIFY"
        ? `${process.env.DOMAIN}/verifyemail?token=${token}`
        : `${process.env.DOMAIN}/resetpassword?token=${token}`;

    const mailoptions = {
      from: "hitesh@gmail.com",
      to: email,
      subject: emailtype === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${url}">here</a> to ${
        emailtype === "VERIFY" ? "verify your email" : "reset your password"
      }<br>Or copy and paste this link: ${url}</p>`,
    };

    await transporter.sendMail(mailoptions);
    console.log("Mail sent successfully");
  } catch (err: any) {
    throw new Error("Error sending email: " + err.message);
  }
};

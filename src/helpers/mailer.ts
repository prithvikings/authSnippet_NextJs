import User from "@/models/user.model";
import nodemailer from "nodemailer";
import crypto from "crypto";

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
    // generate a random token
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    if (emailtype === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifytoken: hashedToken,
        verifytokenexpiry: Date.now() + 3600000, // 1h
      });
    } else if (emailtype === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry: Date.now() + 3600000, // 1h
      });
    }

    // setup mail transporter
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAIL_USER!, // move creds to .env
        pass: process.env.MAIL_PASS!,
      },
    });

    const url =
      emailtype === "VERIFY"
        ? `${process.env.NEXT_PUBLIC_HOST}/api/users/verifyemail?token=${token}`
        : `${process.env.NEXT_PUBLIC_HOST}/api/users/resetpassword?token=${token}`;

    const mailoptions = {
      from: "hitesh@gmail.com",
      to: email,
      subject: emailtype === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${url}">here</a> to ${
        emailtype === "VERIFY" ? "verify your email" : "reset your password"
      }<br> Or copy and paste this link: ${url}</p>`,
    };

    const mailresponse = await transporter.sendMail(mailoptions);
    return mailresponse;
  } catch (err: any) {
    throw new Error("Error sending email: " + err.message);
  }
};


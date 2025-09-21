import User from "@/models/user.model";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import {MailtrapTransport} from "mailtrap";
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
    const token = process.env.MAIL_TOKEN;
    const hashtoken = await bcryptjs.hash(userId.toString(), 10);
    if (emailtype === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifytoken: hashtoken,
        verifytokenexpiry: Date.now() + 3600000,
      });
    } else if (emailtype === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashtoken,
        forgotPasswordExpiry: Date.now() + 3600000,
      });
    }

    // Create a test account or replace with real credentials.
    const transporter = nodemailer.createTransport(
      MailtrapTransport({
        token: token,
        testInboxId: 4046639,
      })
    );

    const mailoptions = {
      from: "prithvi07raj07@gmail.com", // sender address
      to: email, // list of receivers
      subject:
        emailtype === "VERIFY" ? "Verify your email" : "Reset your password", // Subject line
      html:
        emailtype === "VERIFY"
          ? "<p>Please verify your email</p>"
          : "<p>Please reset your password</p>", // HTML body
    };

    const info = await transporter.sendMail(mailoptions);
    return info;
  } catch (err) {
    throw new Error("Error sending email: " + err);
  }
};

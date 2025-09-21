import nodemailer from 'nodemailer';

export const sendEmail=async ({email,emailtype,userId }:{email:string,emailtype:string,userId:string})=>{
    try{
        // Create a test account or replace with real credentials.
    const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "maddison53@ethereal.email",
                pass: "jn7jnAPss4f63QBp6D",
        },
    });

    const mailoptions={
            from: "prithvi07raj07@gmail.com", // sender address
            to: email, // list of receivers
            subject: emailtype==="VERIFY"? "Verify your email":"Reset your password", // Subject line
            html: emailtype==="VERIFY"?"<b>Please verify your email</b>":"<b>Please reset your password</b>", // HTML body
  }

    const info = await transporter.sendMail(mailoptions);
    return info;
    }catch(err){
        throw new Error("Error sending email: "+err);
    }
}
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendAccountVerificationEmail = async (to, resetToken) => {
  try {
    //create Transport
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_EMAIL, // user email address
        pass: process.env.MAIL_PASS, //password
      },
    });

    //create message
    const message = {
      to,
      subject: "Account Verification - Blogify",
      html: `<p>You are receiving this email because you (or someone else) have requested to verify the account.</p>
        <p>Please click on the link, or paste this into your browser to complete the process:</p>
        <p>http://localhost:3000/verify-account/${resetToken}</p>
        <p>If you did not request this, please ignore this email</p>
        `,
    };

    //send the email

    const info = await transporter.sendMail(message);
    console.log("Email sent", info.messageId);
  } catch (ex) {
    console.log(ex);
    // For the time being not passing the error
    // throw new Error("Email Sending Failed");
  }
};

export default sendAccountVerificationEmail;

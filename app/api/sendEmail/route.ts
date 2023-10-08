import { NextResponse } from "next/server";
const nodemailer = require('nodemailer');

export async function POST(req: Request) {
  
  const { message, senderEmail, recepientEmail, email } = await req.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail', // replace with your email service
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  // Set up email data
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: `${recepientEmail}`,
    subject: `KAKEHASHI SPACE APP - New message from ${email}`,
    text: `From ${email}:\n${message}`,
  };

  try {
    const emailResponse = await transporter.sendMail(mailOptions);
    return NextResponse.json({ status: "201", message: `Email sent: ${emailResponse}` });
  } catch (error) {
    return NextResponse.json({ status: "500", message: error });
  }

}
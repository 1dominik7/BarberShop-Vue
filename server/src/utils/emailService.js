import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const transport = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendMail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: "sanber.barbershop@interia.pl",
      to,
      subject,
      text,
      html,
    };

    await transport.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import { transporter } from "./email.config.js";

export const sendmail = async ({to, subject, text, html}) => {
    try {
        console.log("SMTP_USER:", process.env.SMTP_USER);
        console.log("SMTP_PASS exists:", !!process.env.SMTP_PASS);
        const response = await transporter.sendMail({
            from: '"Techedu" <prajapatibanshraj57@gmail.com>', // sender address
            to: to, // list of recipients
            subject: subject, // subject line
            text: text, // plain text body
            html: html, // HTML body
        });

        console.log("Message sent: %s", response);
        // Preview URL is only available when using an Ethereal test account
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(response));
        return response;
    } catch (err) {
        console.error("Error while sending mail:", err);
    }
};

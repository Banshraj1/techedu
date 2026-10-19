// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();
import { transporter,SMTP2GOtransporter } from "./email.config.js";

export const sendmail = async ({to, subject, text, html}) => {
    try {
        console.log("send.email.js file in use");
        const response = await SMTP2GOtransporter.sendMail({
            from: '"Techedu" <banshraj_ug_24@ei.nits.ac.in>', // sender address
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
        throw err
    }
};

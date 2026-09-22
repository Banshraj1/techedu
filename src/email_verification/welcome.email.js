import { sendmail } from "./send.email.js";
// import dotenv from "dotenv";
import { Welcome_Email_Template } from "./welcome.template.js";

const sendWelcomeEmail = async ({ to, name }) => {
    const subject = "Welcome to Our Community";
    const text = `Welcome to our community, ${name || "N/A"}!`;
    const html = Welcome_Email_Template.replace("{name}", name || "N/A");
    return sendmail({ to, subject, text, html });
};

export { sendWelcomeEmail };

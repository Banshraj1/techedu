import { sendmail } from "./send.email.js";
// import dotenv from "dotenv";
import { Verification_Email_Template } from "./otpVerification.template.js";

const sendVerificationEmail = async (to, verificationCode) => {
    const subject = "Email Verification";
    const text = `Your verification code is: ${verificationCode}`;
    const html = Verification_Email_Template.replace(
        "{verificationCode}",
        verificationCode || "N/A",
    );
    return sendmail({ to, subject, text, html });
};

export { sendVerificationEmail };

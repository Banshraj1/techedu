import { asyncHandler, ApiError, ApiResponse } from "../utils/index.js";
import { User } from "../model/user.model.js";
import { OTP } from "../model/otp.model.js";
import { sendWelcomeEmail } from "../email_verification/welcome.email.js";
import { sendVerificationEmail } from "../email_verification/otpverification.email.js";
// import { use } from "react";

/*
is file me vo controller rahega jo user pr perform hoga jaise update details like password login register history update ,playlist update, and create,token generation
*/

// further to improve this add OTP feature also
const getOTP = asyncHandler(async (req, res) => {
    // ye wala function frontend se email lekr uspr otp send krwa dega
    const { email } = req.body;
    const alreadyRegisteredUser = await User.findOne({ email: email }).select(
        "-password",
    );

    if (alreadyRegisteredUser !== null) {
        console.log(
            "User with this email already registered",
            alreadyRegisteredUser,
        );
        throw new ApiError(
            400,
            "User with this email already registered",
            alreadyRegisteredUser,
        );
    }

    const verificationCode = Math.floor(
        100000 + Math.random() * 900000,
    ).toString();
    // store this code and email in db

    const otp = await OTP.create({
        otp: verificationCode,
        email: email,
    });
    // console.log(otp);
    if (!otp) {
        throw new ApiError(
            501,
            "Something went wrong during otp generating...",
        );
    }

    const response = await sendVerificationEmail(email, verificationCode); // send otp on email
    // console.log(response);

    return res
        .status(200)
        .json(new ApiResponse(200, { success: true }, "otp send successfully"));
});
const registerUser = asyncHandler(async (req, res) => {
    /*
    to check if required fields are present
    username, email, phone no, Password
    check if user already registered
    create a new user using USER MODEL 
    check if user generated successfully 
    return data after removing password from that

    */

    const { username, email, phone = "1234567890", password } = req.body;

    // ye wala block problem create kr rha hai

    // if ([username, email, phone, password].some((value) => !value?.trim())) {
    //   console.log("all fields are required");
    //   throw new ApiError(404, "All fields are required");
    // }
    console.log(username, email, phone, password);
    const isVerifiedUser = await OTP.findOne({ email: email }).select("-otp");

    // console.log(verifiedUser);

    if (isVerifiedUser === null) {
        console.log(
            "this email is not verified or verified before 30 minutes kindly restart again",
        );
        throw new ApiError(
            400,
            "this email is not verified or verified before 30 minutes kindly restart again",
            null,
        );
    }

    const newUser = await User.create({
        username: username,
        email: email,
        phone: phone,
        password: password,
    });

    console.log(newUser);

    const welcomeEmailSent = await sendWelcomeEmail({
        to: newUser.email,
        name: newUser.username,
    });
    if (!welcomeEmailSent) {
        console.error("Failed to send welcome email");
        // We might want to handle this case differently, depending on your requirements
    }
    const response = await User.findById(newUser._id).select("-password");

    if (response == null) {
        throw new ApiError(501, "Something went wrong during user creation...");
    }
    // console.log("User registered successfully");

    return res
        .status(200)
        .json(new ApiResponse(200, response, "user created successfully"));
});

const verifyOTP = asyncHandler(async (req, res) => {
    const { code, email } = req.body;

    const alreadyRegisteredUser = await User.findOne({ email: email }).select(
        "-password",
    );
    if (alreadyRegisteredUser !== null) {
        throw new ApiError(
            405,
            "user with this email already exists",
            alreadyRegisteredUser,
        );
    }
    const OTPResponse = await OTP.findOne({ otp: code });
    if (OTPResponse === null) {
        throw new ApiError(404, "Invalid otp ", {});
    }
    const isOTPcorrect = OTPResponse.isOTPCorrect(email);
    if (!isOTPcorrect) {
        throw new ApiError(404, "BAD REQUEST Invalid otp or email", {});
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                true,
                "Email verified successfully otp was verified",
            ),
        );
});
export { getOTP, registerUser, verifyOTPraju };

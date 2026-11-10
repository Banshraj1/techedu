import mongoose from "mongoose";
import { type } from "os";
import { MAX } from "uuid";
const otpSchema = new mongoose.Schema(
    {
        otp: {
            type: Number,
            required: true,
            MAX: 6,
        },
        email: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });
otpSchema.methods.isOTPCorrect = async function (email) {
    return this.email == email;
};

export const OTP = mongoose.model("OTP", otpSchema);

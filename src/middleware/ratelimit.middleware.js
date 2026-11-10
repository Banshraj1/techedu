import rateLimit from "express-rate-limit";
const authLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        error: "Too many authentication attempts. Please try again later.",
    },
});
export { authLimit };

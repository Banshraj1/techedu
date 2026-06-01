import dotenv from "dotenv";
import express from "express";
import { connectdb } from "./db/connectdb.js";
import cors from "cors";
dotenv.config();
const port = process.env.port;
const app = express();

app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.raw({ limit: "16kb" }));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// it will help in reading cookie which req  brings from frontend
import cookieParser from "cookie-parser";
app.use(cookieParser());

// routing for app
import { router } from "./routes/user.route.js";
import { adminRouter } from "./routes/adminRouter.route.js";

app.use("/techedu/v1", router);
app.use("/techedu/v1/admin", adminRouter);

export default app;

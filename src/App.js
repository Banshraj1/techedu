import dotenv from "dotenv";
import express from "express";
import { connectdb } from "./db/connectdb.js";
import cors from "cors"
dotenv.config({});
const port = process.env.port;
const app = express();

app.use(cors())
app.use(express.json({limit:'16kb'}))
app.use(express.raw({limit:'16kb'}))
app.use(express.static('public'))
app.use(express.urlencoded({limit:'16kb'}))

// routing for app

import { router } from "./routes/user.route.js";

app.use("/techedu/v1",router)


export default app
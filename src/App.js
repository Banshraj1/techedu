import dotenv from "dotenv";
import express from "express";
import { connectdb } from "./db/connectdb.js";
dotenv.config({});
const port = process.env.port;
const app = express();

app.use(cors())
app.use(express.json({limit:'16kb'}))
app.use(express.raw({limit:'16kb'}))
app.use(express.static('public'))


export default app
import dotenv from "dotenv";
// import express from "express";
dotenv.config({});
const port = process.env.port;
// const app = express();
import app from "./src/App.js";
import { connectdb } from "./src/db/connectdb.js";

connectdb()
  .then(() => {
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });
    app.listen(port, (req, res) => {
      console.log(port);
      console.log("app is listening on port 3000");
    });
  })
  .catch((error) => {
    console.log("db connection error", error);
    throw new error("DB connection error")
    // app.on("error")
  });

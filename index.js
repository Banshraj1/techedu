import dotenv from "dotenv";
dotenv.config({});
const port = process.env.PORT;
import app from "./src/App.js";
import { connectdb } from "./src/db/connectdb.js";

connectdb()
  .then(() => {
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });
    // removed for deployement purpose only
    // app.listen(port, (req, res) => {
    //   console.log(`app is listening on port ${port}`);
    // });
  })
  .catch((error) => {
    console.log("db connection error", error);
    throw new error("DB connection error");
    // app.on("error")
  });

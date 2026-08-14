import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Working");
});
app.get("/test", (req, res) => {
    res.send("Working test is good");
});

app.listen(8000, () => {
  console.log("running");
});
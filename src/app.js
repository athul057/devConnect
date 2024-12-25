//request handlers.
const express = require("express");
const app = express();

app.use("/home", (req, res) => {
 res.send("hello from my app")
})

app.listen(3000, () => {
 console.log("server is listening...")
})
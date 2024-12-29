const express = require("express");
const connectDB = require("./config/database");
const app = express();
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")


const cookieParser = require("cookie-parser")
const jwt = require('jsonwebtoken');


//This midddleware will convert from json to js object and add into the req.body.So we will get req.body in the form of javascript object...
//express.json()=>Converts from json to javascript object and put inside the req.body.
app.use(express.json())
app.use(cookieParser())


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);



// Connect to the database
connectDB()
 .then(() => {
  // Start the server only after the database connection is successful
  console.log("Server connected to database...")
  app.listen(3000, () => {
   console.log("Server is listening on port 3000...");
  });
 })
 .catch((err) => {
  console.error("Server could not start due to database connection error." + err.message);
 });

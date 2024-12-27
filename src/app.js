const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { isObjectIdOrHexString } = require("mongoose");
const { validateUserSignUp } = require("./utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/userAuth')

//This midddleware will convert from json to js object and add into the req.body.So we will get req.body in the form of javascript object...
//express.json()=>Converts from json to javascript object and put inside the req.body.
app.use(express.json())
app.use(cookieParser())

app.post("/signup", async (req, res) => {

 //Creating a new instance of the usermodel.

 try {

  //VALIDATION OF OUR DATA.......
  validateUserSignUp(req)

  const { password, firstName, lastName, emailId } = req.body;

  //ENCRYPTING OUR PASSWORD....
  const encryptedPassword = await bcrypt.hash(password, 10)

  const user = new User({
   firstName, lastName, password: encryptedPassword, emailId
  });
  await user.save();
  res.send("user created..")
 } catch (error) {
  res.status(404).send("ERROR: " + error.message)
 }


})


app.post("/login", async (req, res) => {

 try {
  const { emailId, password } = req.body;
  const user = await User.findOne({ emailId })

  if (!user) {
   throw new Error("User is not registerd.")
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
   res.status(401).send("Invalid password.");
  }
  else {
   const token = await jwt.sign({ _id: user._id }, "athul")
   console.log(token);
   res.cookie("token", token)

   res.send("Logged in.")
  }


 } catch (error) {
  res.status(404).send("ERROR: ", error.message)
 }

})
//************************************************************************************************************************************* */


// app.get("/profile", userAuth, async (req, res) => {
//  try {
//   console.log(req)
//   const cookie = await req.cookies;
//   const { token } = cookie;
//   if (!token) {
//    throw new Error("Please login.")
//   }
//   const isValidToken = await jwt.verify(token, 'athul')
//   console.log(isValidToken);
//   const user = await User.findById(isValidToken._id);
//   if (!user) {
//    throw new error("Please login.")
//   }
//   else {
//    // const {_id}=cookie.id;
//    res.send(user);
//   }
//  } catch (error) {
//   res.status(404).send("ERROR: " + error.message)
//  }
// })

//***************************************************************************************************************************************** */

app.get("/profile", userAuth, async (req, res) => {
 try {
  const user = req.user;
  res.send(user);
 } catch (error) {
  res.status(404).send("ERROR: " + error.message)
 }
})

//GET A USER BY EMAIL......

app.get("/user", async (req, res) => {

 const emailId = req.body.emailId
 try {

  //Returns in the form of array....
  const user = await User.find({ emailId })

  if (user.length === 0) {
   res.status(400).send("No user found with this email.")
  }
  else {
   res.send(user)
  }

 } catch (error) {
  res.status(404).send("Something went wrong....")
 }
})


//GET ALL THE USERS FROM DB..

app.get("/feed", async (req, res) => {
 try {
  const users = await User.find({})
  res.send(users);

 } catch (error) {
  res.status(404).send("Something went wrong...")
 }
})

//DELETE A USER BY ID

app.delete("/user", async (req, res) => {
 const userId = req.body.userId;
 try {
  const user = await User.findByIdAndDelete(userId);

  //WE CAN ALSO USE THIS....
  // const user =await User.findByIdAndDelete({_id:userId})
  if (!user) {
   res.status(404).send("User not found");
  } else {
   res.send("User deleted successfully.");
  }
 } catch (error) {
  console.error("Error deleting user:", error);
  res.status(500).send("An error occurred while deleting the user.");
 }
});

//UPDATE A USER INFO

app.patch("/user/:userId", async (req, res) => {
 const ALLOWED_UPDATES = ["lastName", "bio", "photoUrl", "gender", "about", "age"];
 const userId = req.params?.userId;
 const data = req.body;
 try {
  //if every element in the array won't satiesfy the give call back condition it will return false.....
  const isAllowed = Object.keys(data).every((k) => {

   return ALLOWED_UPDATES.includes(k)
  });
  if (!isAllowed) {
   throw new Error("Updatesss not allowed.")
  }
  if (data?.bio.length > 5) {
   throw new Error("skills should be less than 5")
  }
  const user = await User.findByIdAndUpdate({ _id: userId }, data, {
   runValidators: true,
   returnDocument: "after"
  }

  )
  if (!user) {
   res.status(404).send("User not found");
  }
  else {
   res.send("user updated successfully...")
  }

 } catch (error) {
  res.status(404).send("something went wrong." + error.message)
 }
})



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
  console.error("Server could not start due to database connection error.", err);
 });

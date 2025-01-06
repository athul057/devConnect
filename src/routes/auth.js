const express = require("express")
const authRouter = express.Router();
const User = require("../models/user");
const { validateUserSignUp } = require("../utils/validation")
const bcrypt = require("bcrypt")



authRouter.post("/signup", async (req, res) => {

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
  const newUser = await user.save();
  //logging the new use user....

  const token = await newUser.jwtValidation();

  res.cookie("token", token)
  res.json({
   message: "user created",
   data: newUser
  })
 } catch (error) {
  res.status(404).send("ERROR: " + error.message)
 }


})


authRouter.post("/login", async (req, res) => {

 try {
  const { emailId, password } = req.body;
  const user = await User.findOne({ emailId })

  if (!user) {
   throw new Error("User is not registerd.")
  }
  // const isPasswordValid = await bcrypt.compare(password, user.password);
  const isPasswordValid = await user.passwordValidation(password)
  if (!isPasswordValid) {
   res.status(401).send("Invalid credentilas..");
  }
  else {
   const token = await user.jwtValidation();

   res.cookie("token", token)

   res.json({
    message: "Logged In",
    user
   })
  }


 } catch (error) {
  res.status(500).send("ERROR: " + error.message)
 }

})

authRouter.post("/logout", async (req, res) => {

 await res.cookie("token", null, { expires: new Date(Date.now()) })
 res.send("Logged out...")
})

module.exports = authRouter;
const express = require("express")
const { userAuth } = require('../middlewares/userAuth')
const { validateEditProfileData } = require('../utils/validation')
const User = require("../models/user");



const profileRouter = express.Router();


profileRouter.get("/profile/view", userAuth, async (req, res) => {
 try {
  const user = req.user;
  res.send(user);
 } catch (error) {
  res.status(404).send("ERROR: " + error.message)
 }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
 try {
  const editingData = req.body;
  const loggedInUserData = req.user;
  if (!validateEditProfileData(req)) {
   throw new Error("Edit is not allowed.")
  }
  else {
   console.log("keys are " + Object.keys(editingData))
   Object.keys(editingData).forEach((key) => loggedInUserData[key] = editingData[key]);
   await loggedInUserData.save();
   res.json({ "message": "edit successful", "user": loggedInUserData })
  }

 } catch (error) {
  res.status(404).send("ERROR " + error.message);
 }
})


module.exports = profileRouter
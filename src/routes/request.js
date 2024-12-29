const express = require("express")
const { userAuth } = require('../middlewares/userAuth')
const ConnectionRequest = require('../models/connectRequest')
const User = require("../models/user")



const requestRouter = express.Router();


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
 try {
  const fromUserId = req.user._id;
  const toUserId = req.params.toUserId;
  const status = req.params.status;

  const ALLOWED_STATUS = ["intrested", "ignored"]
  if (!ALLOWED_STATUS.includes(status)) {
   res.status(400).json({
    message: "status is incorrect,Please check it."
   })
   return;
  }
  const existingConnectionRequest = await ConnectionRequest.findOne({
   $or: [
    { fromUserId, toUserId },
    { fromUserId: toUserId, toUserId: fromUserId }
   ]
  })
  if (existingConnectionRequest) {
   res.status(400).json({
    message: "Connection request is already exists."
   })
   return;
  }

  const checkUser = await User.findById(toUserId);
  if (!checkUser) {
   return res.status(404).json("User is not found..")
  }
  const connectionRequest = new ConnectionRequest({ fromUserId, toUserId, status })
  const data = await connectionRequest.save();
  res.json({
   Message: "Connection Request send successfully",
   Data: data
  })

 } catch (error) {
  res.status(400).json({ "message": "ERROR " + error.message })
 }
})


requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
 try {
  const ALLOWED_STATUS = ["accepted", "rejected"]
  const { status, requestId } = req.params;
  const logInUser = req.user;
  if (!ALLOWED_STATUS.includes(status)) {
   res.status(400).json({
    message: "status is not correct"
   })
   return;
  }
  const connectionRequest = await ConnectionRequest.findOne({ _id: requestId, toUserId: logInUser._id, status: "intrested" })
  if (!connectionRequest) {
   res.status(400).json({
    message: "request is not found."
   })
   return
  }
  connectionRequest.status = status;
  const data = await connectionRequest.save();
  res.json({ message: "connection request " + status, data })

 } catch (error) {
  res.status(404).json({ message: "ERROR " + error.message })
 }

})

module.exports = requestRouter;
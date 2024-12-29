const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const userRouter = express.Router();
const connectionRequest = require("../models/connectRequest")

//GET ALL PENDING CONNECTION REQUEST TO THE USER.....
//ref and populate.. to linke between to collections in mongoDB...
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
 try {
  const logInUser = req.user;
  const connectionRequests = await connectionRequest.find({
   toUserId: logInUser._id, status: "intrested"
  }).populate("fromUserId", "firstName lastName imageUrl age")
  // }).populate("fromUserId", ["firstName", "lastName"])
  res.json({
   message: "Data fetched successfully",
   data: connectionRequests
  })
 } catch (error) {
  res.status(400).json({
   message: "ERROR " + error.message

  })
 }
})


userRouter.get("/user/requests/connections", userAuth, async (req, res) => {
 try {
  const loginUser = req.user;
  const connectionRequests = await connectionRequest.find({ $or: [{ fromUserId: loginUser._id, status: "accepted" }, { toUserId: loginUser._id, status: "accepted" }] })
   .populate("fromUserId", ["firstName", "lastName"]).populate("toUserId", ["firstName", "lastName"])
  const filteredData = connectionRequests.map((connectionRequest) => {
   if (connectionRequest.fromUserId.equals(loginUser._id)) {
    return connectionRequest.toUserId;
   }
   return connectionRequest.fromUserId;
  })
  res.json({
   message: "all connections fetched",
   data: filteredData
  })
 } catch (error) {
  res.status(404).json({
   message: "ERROR " + error.message
  })
 }
})

module.exports = userRouter;
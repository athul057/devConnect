const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const userRouter = express.Router();
const connectionRequest = require("../models/connectRequest")
const Users = require("../models/user")

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


   // if (connectionRequest.fromUserId.toString()===loginUser._id.toString()){}
   // OR

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


userRouter.get("/feed", userAuth, async (req, res) => {

 try {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;
  const logInUser = req.user;
  const connectedUsers = await connectionRequest.find({
   $or: [{ fromUserId: logInUser._id }, { toUserId: logInUser._id }]
  }).select("fromUserId toUserId").lean()
  const hideUserId = new Set()
  connectedUsers.forEach((user) => {
   hideUserId.add(user.fromUserId.toString());
   hideUserId.add(user.toUserId.toString());

  })

  const feedUsers = await Users.find({
   $and: [{ _id: { $nin: Array.from(hideUserId) } }, { _id: { $ne: logInUser._id } }]
  }).select("firstName lastName about photoUrl")
   .skip(skip)
   .limit(limit)
  //....................OR.............................
  // const feedUsers = await Users.find({
  //  _id: {
  //   $nin: [...Array.from(hideUserId), logInUser._id]
  //  }
  // })
  //....................................................
  res.json({
   message: "user fetched successfully",
   data: feedUsers
  })

 } catch (error) {
  res.status(400).json({
   message: "ERROR " + error.message
  })
 }


})


module.exports = userRouter;



////     /feed/?id===>Her id is query to get this req.query.id
////     /feed:id=2====>Here id is params .To get this req.params.id
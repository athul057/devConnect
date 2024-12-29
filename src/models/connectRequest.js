const mongoose = require("mongoose");
const { userAuth } = require("../middlewares/userAuth");
const userModel = require("./user");

//IF WE MAKE index=true THEN OUR QUERY WILL BE VERY FAST....
//WE CAN GET THE DETAILS FASTLY...
//WHEN WE MAKE unique=true MONGODB WILL AUTOMATICALLY MAKE index=true
//COMPOUND INDEX=>combining 2 items togerther for indexing...
//why we shouldn't use index on all items in the database???

const connectionRequestSchema = new mongoose.Schema({
 fromUserId: {
  type: mongoose.Schema.ObjectId,
  ref: "User",
  require: true
 },
 toUserId: {
  type: mongoose.Schema.ObjectId,
  ref: "User",
  required: true
 },
 status: {
  type: String,
  required: true,
  enum: {
   values: ["accepted", "ignored", "rejected", "intrested"],
   message: `{VALUE} is incorrect status type.`
  }
 }
},
 {
  timestamps: true
 })


connectionRequestSchema.pre("save", function (next) {
 const connectionRequest = this;
 if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
  return next(new Error("Can't make from and to address the same."));
 }
 next();
});

//THIS WILL MAKES OUR QUERYING FAST.....
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

const connectionRequestModel = new mongoose.model("connectionRequest", connectionRequestSchema)




module.exports = connectionRequestModel
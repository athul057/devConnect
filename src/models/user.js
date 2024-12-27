const mongoose = require("mongoose")
const validator = require("validator")

const UserSchema = new mongoose.Schema({
 firstName: {
  type: String,
  required: true,
  minLength: 4,
  maxLength: 50

 },
 lastName: {
  type: String
 },
 emailId: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true,
  validate(value) {
   if (!validator.isEmail(value)) {
    throw new Error("It is not a correct email form.")
   }
  }
 },
 password: {
  type: String
 },
 age: {
  type: Number,
  min: 18
 },
 photoUrl: {
  type: String,
  default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIwTiGhEbkT1_hRJIuuvfatzFEaSIk6sgzqA&s",
  validate(value) {
   if (!validator.isURL(value)) {
    throw new Error("It is not a correct url form.")
   }
  }
 },
 about: {
  type: String,
  default: "My Default about."
 },
 bio: {
  type: [String]
 },
 gender: {
  type: String,
  validate(value) {
   if (!['male', 'female', 'others'].includes(value)) {
    throw new Error("Gender is not valid")
   }
  }


 },

},
 {
  timestamps: true
 })

const userModel = mongoose.model("User", UserSchema)

module.exports = userModel;
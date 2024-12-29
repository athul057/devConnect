const validator = require("validator")
const User = require("../models/user");

const validateUserSignUp = (req) => {
 const { firstName, lastName, emailId, password } = req.body;
 if (!firstName || !lastName) {
  throw new Error("Please enter a first name and last name")
 }
 else if (firstName.length < 4 || firstName.length > 50) {
  throw new Error("Name is not valid")
 }
 else if (!validator.isEmail(emailId)) {
  throw new Error("Email is not valid..")
 }
 else if (!validator.isStrongPassword(password)) {
  throw new Error("password is not strong")
 }
}



const validateEditProfileData = (req) => {
 const allowedEdit = ["firstName", "gender", "about", "age", "bio", "photoUrl", "lastName"];

 const data = req.body;
 console.log(data);

 // Check if every key in `data` is allowed
 const isEditAllowed = Object.keys(data).every((k) => allowedEdit.includes(k));
 console.log(isEditAllowed);
 return isEditAllowed;
};


module.exports = { validateUserSignUp, validateEditProfileData }
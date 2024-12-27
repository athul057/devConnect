const jwt = require("jsonwebtoken")
const User = require("../models/user")



const userAuth = async (req, res, next) => {
 try {
  const cookie = req.cookies;
  const token = cookie.token;
  if (!token) {
   throw new Error("Please login")
  }
  const isValidToken = await jwt.verify(token, 'athul');
  const { _id } = isValidToken;
  const user = await User.findById(_id);
  if (!user) {
   throw new Error("Please login.")
  }
  else {
   req.user = user;
   next();
  }
 } catch (error) {
  res.status(404).send("ERROR" + error.message)
 }


}

module.exports = { userAuth };
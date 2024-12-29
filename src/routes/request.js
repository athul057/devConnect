const express = require("express")
const { userAuth } = require('../middlewares/userAuth')



const requestRouter = express.Router();


requestRouter.post("/secConnectionRequest", userAuth, (req, res) => {
 const user = req.user;
 res.send(user.firstName + "send me connection request")
})

module.exports = requestRouter;
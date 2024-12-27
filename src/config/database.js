const mongoose = require("mongoose")


const connectDB = async () => {
 await mongoose.connect("mongodb+srv://athul:athul@devconnect.5gmvp.mongodb.net/devConnect?retryWrites=true&w=majority&appName=devConnect")
}

module.exports = connectDB






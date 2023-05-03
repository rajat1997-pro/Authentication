const newLocal = "mongoose"
const mongoose = require(newLocal)


const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

module.exports = mongoose.model("user", userSchema)
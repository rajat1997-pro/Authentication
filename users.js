const newLocal = "mongoose"
const mongoose = require(newLocal)
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})
userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("user", userSchema)
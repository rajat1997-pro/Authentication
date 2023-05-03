const newLocal = "mongoose"
const mongoose = require(newLocal)
const passportLocalMongoose = require("passport-local-mongoose")
const findOrCreate = require("mongoose-findorcreate")

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    secret: String
})
userSchema.plugin(passportLocalMongoose)
userSchema.plugin(findOrCreate)

module.exports = mongoose.model("user", userSchema)
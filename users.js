const newLocal = "mongoose"
const mongoose = require(newLocal)
const newLocal2 = "mongoose-encryption"
const encrypt = require(newLocal2)

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] })

module.exports = mongoose.model("user", userSchema)
const newLocal_1 = "dotenv"
require(newLocal_1).config()
const express = require("express")
const app = express()
const ejs = require("ejs")
const bcrypt = require("bcrypt")
const saltRounds = 10
const newLocal = "mongoose"
const mongoose = require(newLocal)

const User = require("./users")
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

app.set("view engine", "ejs")

//connecting to the database
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/userDB")
    console.log("Connected to the database")
}
main().catch(err => {
    console.log(err.message)
})

app.get("/", (req, res) => {
    res.render("home")
})
app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", (req, res) => {
    const userName = req.body.username
    const password = req.body.password
    async function main() {
        const user = await User.findOne({ email: userName })
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    console.log(err.message)
                }
                else {
                    if (result === true) {
                        res.render("secrets")
                    }
                    else {
                        res.send("<h1>Password is incorrect!!</h1>")
                    }
                }

            })

        }
        else {
            res.send("<h1>User does'nt exists!!</h1>")
        }
    }
    main().catch(err => {
        console.log(err.message)
    })
})
app.get("/register", (req, res) => {
    res.render("register")
})

app.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (err) {
            console.log(err.message)
        }
        else {
            const username = req.body.username
            const password = hash
            async function main() {
                const user = await User.create({ email: username, password: password })
                console.log(user)
                res.render("secrets")
            }
            main().catch(err => {
                console.log(err.message)
            })

        }
    })


})

app.listen(3000, () => {
    console.log("Server is running at port 3000.")
})
const newLocal_1 = "dotenv"
require(newLocal_1).config()
const express = require("express")
const app = express()
const ejs = require("ejs")
const newLocal = "mongoose"
const mongoose = require(newLocal)
const session = require("express-session")
const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("./users")


app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

app.set("view engine", "ejs")

app.use(session({
    secret: 'Our little secret.',
    resave: false,
    saveUninitialized: true,
}))

app.use(passport.initialize())
app.use(passport.session())

//connecting to the database
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/userDB")
    console.log("Connected to the database")
}
main().catch(err => {
    console.log(err.message)
})
passport.use(User.createStrategy())

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
},
    function (accessToken, refreshToken, profile, cb) {
        console.log(profile)
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));


app.get("/", (req, res) => {
    res.render("home")
})

app.route('/auth/google')

    .get(passport.authenticate('google', {

        scope: ['profile']

    }));

app.route("/auth/google/secrets").get(passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        res.redirect("/secrets")
    })
// app.get('/auth/google/secrets',
//     passport.authenticate('google', { failureRedirect: '/login' }),
//     function (req, res) {
//         // Successful authentication, redirect home.
//         res.redirect('/');
//     });

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })
    req.login(user, (err) => {
        if (err) {
            console.log(err.message)
        }
        else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secrets")
            })
        }
    })
})
app.get("/register", (req, res) => {
    res.render("register")
})
app.get("/secrets", (req, res) => {
    async function main() {
        const user = await User.find({ "secret": { $ne: null } })
        if (users) {
            res.render("secrets", { userWithSecrets: users })
        }
        else {
            console.log("Error Occured")
        }
    }

})

app.get("/submit", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("submit");
    }
    else {
        res.redirect("/login")
    }
})

app.post("/submit", (req, res) => {
    const secret = req.body.secret
    async function main() {
        const user = await User.findById(req.user._id)
        if (user) {
            user.secret = secret
            user.save()
            res.redirect("/secrets")
        }
    }
    main().catch(err => {
        console.log(err.message)
    })
})
app.post("/register", (req, res) => {
    User.register({ username: req.body.username }, req.body.password, (err, user) => {
        if (err) {
            res.redirect("/register")
        }
        else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secrets")
            })
        }
    })
})
app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log(err.message)
        }
        else {
            res.redirect("/")
        }
    })

})

app.listen(3000, () => {
    console.log("Server is running at port 3000.")
})
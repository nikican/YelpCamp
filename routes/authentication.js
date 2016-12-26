var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");

//show register form
router.get("/register", function(req, res) {
    res.render("register");
})

//handle sign up
router.post("/register", function(req, res) {

    var username = req.body.username;
    var password = req.body.password;

    var newUser = new User({
        username: username
    });

    User.register(newUser, password, function(error, user) {
        if (!error) {
            passport.authenticate("local")(req, res, function() {
                req.flash("success", `Welcome to YelpCamp, ${user.username}`);
                res.redirect("/campgrounds");
            });
        }
        else {
            console.log(error);
            req.flash("error", error.message);
            res.redirect("/register");
        }
    });
})

//show login form
router.get("/login", function(req, res) {
    res.render("login");
});

//handle login in
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/register"
}));

//handle log out
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;

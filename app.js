var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    seedDB = require("./seeds"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    expressSession = require("express-session"),
    app = express();


mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    encoded: true
}));
app.use(express.static(__dirname + "/public"));
seedDB();

//PASSPORT CONFIG
app.use(expressSession({
    secret: "Nomi is Russian blue",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.get("/", function(req, res) {
    res.render("landingPage");
});

// =======================
// CAMPGORUND ROUTES
// =======================

//INDEX
app.get("/campgrounds", function(req, res) {

    var currentUser = req.user;

    //get campgrounds from DB
    Campground.find({}, function(error, campgrounds) {
        if (!error) {
            console.log(`Campgorunds retrieved: ${campgrounds.length}`)
            res.render("campgrounds/index", {
                campgrounds: campgrounds
            });
        }
        else {
            console.log("Retrieve error!");
        }
    });
});

//NEW
app.get("/campgrounds/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//CREATE
app.post("/campgrounds", isLoggedIn, function(req, res) {
    var newCampground = req.body.campground;

    Campground.create(newCampground, function(error, campground) {
        if (!error) {
            console.log(`Campgorund ${campground.name} saved.`)
            res.redirect("/campgrounds");
        }
        else {
            console.log("Save error!");
        }
    });
});

//SHOW
app.get("/campgrounds/:id", function(req, res) {
    var campgroundId = req.params.id;

    Campground.findById(campgroundId).populate("comments").exec(function(error, campground) {
        if (!error) {
            console.log(`Campgorund ${campground.name} found.`)
            res.render("campgrounds/show", {
                campground: campground
            });
        }
        else {
            console.log("Save error!");
        }
    });
});

// =======================
// COMMENTS ROUTES
// =======================

//NEW
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    var campgroundId = req.params.id;

    Campground.findById(campgroundId, function(error, campground) {
        if (!error) {
            res.render("comments/new", {
                campground: campground
            });
        }
        else {
            console.log(error);
        }
    });
});

//CREATE
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
    var newComment = req.body.comment;

    var campgroundId = req.params.id;

    //find campground with id
    Campground.findById(campgroundId, function(error, campground) {
        if (!error) {
            console.log(`Campgorund ${campground.name} found.`);

            //save comment
            Comment.create(newComment, function(error, comment) {
                if (!error) {
                    campground.comments.push(comment);

                    //update campground
                    campground.save(
                        function(error, updatedCampgorund) {
                            if (!error) {
                                res.redirect("/campgrounds/" + campground._id);
                            }
                            else {
                                console.log(`Campground ${campground.name} not updated.`);
                            }
                        });
                }
                else {
                    console.log(`Comment not created.`);
                }
            });
        }
        else {
            console.log(`Campground with id: ${campgroundId} not found`);
            res.redirect("/campgrounds");
        }
    });
});

// ======================
// AUTHENTICATION ROUTES
// ======================

//show register form
app.get("/register", function(req, res) {
    res.render("register");
})

//handle sign up
app.post("/register", function(req, res) {

    var username = req.body.username;
    var password = req.body.password;

    var newUser = new User({
        username: username
    });

    User.register(newUser, password, function(error, user) {
        if (!error) {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/campgrounds");
            });
        }
        else {
            console.log(error);
            res.render("register");
        }
    });
})

//show log in form
app.get("/login", function(req, res) {
    res.render("login");
});

//handle login in
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/register"
}));

//log out
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

//C9 IP and port
app.listen(process.env.PORT, process.env.IP, function() {
    console.log(`Server started at ${process.env.IP}:${process.env.PORT}`);
});

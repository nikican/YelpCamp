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

// aquire routes
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    authenticationRoutes = require("./routes/authentication");

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

// root route
app.get("/", function(req, res) {
    res.render("landingPage");
});

// use routes
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", authenticationRoutes);

// server start
app.listen(process.env.PORT, process.env.IP, function() {
    console.log(`Server started at ${process.env.IP}:${process.env.PORT}`);
});

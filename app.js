var express = require("express"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    seedDB = require("./seeds"),
    db = require('./models/db'),
    User = require("./models/user"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    expressSession = require("express-session"),
    routes = require("./routes"),
    app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


//passport config
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

// locals
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.errorMessage = req.flash("error");
    res.locals.successMessage = req.flash("success");
    next();
});

app.use(routes);

// root route
app.get("/", function(req, res) {
    res.render("landing");
});

// server start
app.listen(process.env.PORT, process.env.IP, function() {
    console.log(`Server started at ${process.env.IP}:${process.env.PORT}`);
});

var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground");

// campground index
router.get("/", function(req, res) {

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

// campground new
router.get("/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// campground create
router.post("/", isLoggedIn, function(req, res) {
    var newCampground = req.body.campground;

    Campground.create(newCampground, function(error, campground) {
        if (!error) {
            console.log(`Campgorund ${campground.name} saved.`)
            res.redirect("/");
        }
        else {
            console.log("Save error!");
        }
    });
});

// campground show
router.get("/:id", function(req, res) {
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

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;

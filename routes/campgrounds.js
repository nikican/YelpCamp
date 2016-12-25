var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware");

// campground index
router.get("/", function(req, res) {

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
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// campground create
router.post("/", middleware.isLoggedIn, function(req, res) {
    var newCampground = req.body.campground;

    var author = {
        id: req.user.id,
        username: req.user.username
    };

    newCampground.author = author;

    Campground.create(newCampground, function(error, campground) {
        if (!error) {
            console.log(`Campgorund ${campground.name} created.`)
            res.redirect("/");
        }
        else {
            console.log("Create error!");
        }
    });
});

// campground show
router.get("/:id", function(req, res) {
    var campgroundId = req.params.id;

    Campground.findById(campgroundId).populate("comments").exec(function(error, campground) {
        if (!error) {
            console.log(`Campgorund ${campground.name} found for show.`)
            res.render("campgrounds/show", {
                campground: campground
            });
        }
        else {
            console.log("Show error!");
        }
    });
});

// campground edit
router.get("/:id/edit", middleware.checkCampgroundPermissions, function(req, res) {
    var campgroundId = req.params.id;

    Campground.findById(campgroundId, function(error, campground) {
        res.render("campgrounds/edit", {
            campground: campground
        });
    });
});

// campground update
router.put("/:id", middleware.checkCampgroundPermissions, function(req, res) {
    var campgroundId = req.params.id;

    var updatedCampground = req.body.campground;

    Campground.findByIdAndUpdate(campgroundId, updatedCampground, function(error, campground) {
        if (!error) {
            console.log(`Campgorund ${campground.name} updated.`)
            res.redirect("/campgrounds/" + campgroundId);
        }
        else {
            console.log("Update error!");
        }
    });
});

// campground destroy
router.delete("/:id", middleware.checkCampgroundPermissions, function(req, res) {
    var campgroundId = req.params.id;

    Campground.findByIdAndRemove(campgroundId, function(error, campground) {
        if (!error) {
            console.log(`Campgorund ${campground.name} removed.`)
        }
        else {
            console.log("Delete error!");
        }

        res.redirect("/campgrounds");
    });
});

module.exports = router;

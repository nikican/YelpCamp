var bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    seedDB = require("./seeds"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    express = require("express"),
    app = express();

seedDB();

mongoose.connect("mongodb://localhost/yelp_camp");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    encoded: true
}));

app.get("/", function(req, res) {
    res.render("landingPage");
});

//INDEX
app.get("/campgrounds", function(req, res) {
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
app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});

//CREATE
app.post("/campgrounds", function(req, res) {
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

app.get("/campgrounds/:id/comments/new", function(req, res) {
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
app.post("/campgrounds/:id/comments", function(req, res) {
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

//C9 IP and port
app.listen(process.env.PORT, process.env.IP, function() {
    console.log(`Server started at ${process.env.IP}:${process.env.PORT}`);
});

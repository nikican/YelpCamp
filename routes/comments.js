var express = require("express"),
    router = express.Router({
        mergeParams: true
    }),
    Campground = require("../models/campground"),
    Comment = require("../models/comment");

// comment new
router.get("/new", isLoggedIn, function(req, res) {
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

// cpmment create
router.post("/comments", isLoggedIn, function(req, res) {
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

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;

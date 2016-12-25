var express = require("express"),
    router = express.Router({
        mergeParams: true
    }),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");

// comment new
router.get("/new", middleware.isLoggedIn, function(req, res) {
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

// comment create
router.post("/", middleware.isLoggedIn, function(req, res) {
    var newComment = req.body.comment;

    var author = {
        id: req.user._id,
        username: req.user.username
    };

    newComment.author = author;

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

// comment edit
router.get("/:comment_id/edit", middleware.checkCommentPermissions, function(req, res) {
    var commentId = req.params.comment_id;

    Comment.findById(commentId, function(error, comment) {
        if (!error) {
            console.log(`Comment ${commentId} found for edit`);
            res.render("comments/edit", {
                campgroundId: req.params.id,
                comment: comment
            });
        }
        else {
            console.log("Edit error!");
            res.redirect("back");
        }
    });
});

// comment update
router.put("/:comment_id", middleware.checkCommentPermissions, function(req, res) {
    var commentId = req.params.comment_id;
    var campgorundId = req.params.id;

    var updatedComment = req.body.comment;

    Comment.findByIdAndUpdate(commentId, updatedComment, function(error, comment) {
        if (!error) {
            console.log(`Comment ${commentId} updated`);
            res.redirect("/campgrounds/" + campgorundId);
        }
        else {
            console.log("Update error!");
            res.redirect("back");
        }
    });
});

// comment destroy
router.delete("/:comment_id", middleware.checkCommentPermissions, function(req, res) {
    var commentId = req.params.comment_id;
    var campgorundId = req.params.id;

    Comment.findByIdAndRemove(commentId, function(error, comment) {
        if (!error) {
            console.log(`Comment ${commentId} deleted`);
            res.redirect("/campgrounds/" + campgorundId);
        }
        else {
            console.log("Delete error!");
            res.redirect("back");
        }
    });
});

module.exports = router;

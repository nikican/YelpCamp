var Campground = require("../models/campground"),
    Comment = require("../models/comment");

var middlewareObject = {
    checkCampgroundPermissions: function(req, res, next) {

        //user logged in
        if (req.isAuthenticated()) {
            var campgroundId = req.params.id;

            Campground.findById(campgroundId, function(error, campground) {
                if (!error) {
                    console.log(`Campgorund ${campground.name} found`);

                    //user created the campground
                    if (campground.author.id.equals(req.user._id)) {
                        next();
                    }
                    else {
                        req.flash("error", `No appropriate permission.`);
                        res.redirect("back");
                    }
                }
                else {
                    req.flash("error", `Campgorund with id ${campgroundId} not found.`);
                    console.log("Find error!");
                }
            });
        }
        else {
            req.flash("error", "You need to be logged in.");
            res.redirect("back");
        }
    },

    checkCommentPermissions: function(req, res, next) {

        //user logged in
        if (req.isAuthenticated()) {
            var commentId = req.params.comment_id;

            Comment.findById(commentId, function(error, comment) {
                if (!error) {
                    console.log(`Comment ${comment.name} found`);

                    //user created the comment
                    if (comment.author.id.equals(req.user._id)) {
                        next();
                    }
                    else {
                        req.flash("error", `No appropriate permission.`);
                        res.redirect("back");
                    }
                }
                else {
                    req.flash("error", `Comment with id ${commentId} not found.`);
                    console.log("Find error!");
                }
            });
        }
        else {
            req.flash("error", "You need to be logged in.");
            res.redirect("back");
        }
    },
    isLoggedIn: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        req.flash("error", "Please, login to continue.");
        res.redirect("/login");
    }
};


module.exports = middlewareObject;

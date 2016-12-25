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
                    if (campground.autor.id.equals(req.user._id)) {
                        next();
                    }
                    else {
                        res.redirect("back");
                    }
                }
                else {
                    console.log("Find error!");
                }
            });
        }
        else {
            res.redirect("back");
        }
    },

    checkCommentPermissions: function(req, res, next) {

        //user logged in
        if (req.isAuthenticated()) {
            var commentId = req.params.comment_id;

            Comment.findById(commentId, function(error, comment) {
                if (!error) {
                    console.log(`Campgorund ${comment.name} found`);

                    //user created the comment
                    if (comment.author.id.equals(req.user._id)) {
                        next();
                    }
                    else {
                        res.redirect("back");
                    }
                }
                else {
                    console.log("Find error!");
                }
            });
        }
        else {
            res.redirect("back");
        }
    },
    isLoggedIn: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/login");
    }
};


module.exports = middlewareObject;

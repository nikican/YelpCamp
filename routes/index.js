var express = require('express'),
    router = express.Router(),
    campgroundRoutes = require("./campgrounds"),
    commentRoutes = require("./comments"),
    authenticationRoutes = require("./authentication");

router.use("/campgrounds", campgroundRoutes);
router.use("/campgrounds/:id/comments", commentRoutes);
router.use("/", authenticationRoutes);

module.exports = router

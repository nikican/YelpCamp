var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String
});

var User = mongoose.model("User", userSchema);

module.exports = User;

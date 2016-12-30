var mongoose = require('mongoose'),
    Campground = require("./campground"),
    Comment = require("./comment"),
    User = require("./user");

var databaseURL = process.env.DATABASE_URL || "mongodb://localhost/yelp_camp";

// create the database connection 
mongoose.connect(databaseURL);

// CONNECTION EVENTS
// successfully connected
mongoose.connection.on('connected', function() {
    console.log('Mongoose default connection open to ' + databaseURL);
});

// connection throws an error
mongoose.connection.on('error', function(error) {
    console.log('Mongoose default connection error: ' + error);
});

// disconnected
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose default connection disconnected');
});

// close db connection when node stops
process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

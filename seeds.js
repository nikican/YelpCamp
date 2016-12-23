var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [

    {
        name: "Salmon creek",
        image: "https://farm1.staticflickr.com/112/316612921_f23683ca9d.jpg",
        description: "It's a creek!"

    }, {
        name: "Granite hill",
        image: "https://farm1.staticflickr.com/7/5954480_34a881115f.jpg",
        description: "It's a black rock!"

    }, {
        name: "Shrubbery",
        image: "https://farm9.staticflickr.com/8143/7626450034_4e9fd2be2c.jpg",
        description: "Ni"

    }, {
        name: "Dusk",
        image: "https://farm5.staticflickr.com/4129/5012190187_bf49c45fd4.jpg",
        description: "Campground only exists in dusk. Otherwise it's black hole."
    }
]

function seedDB() {

    //remova all campgrounds
    Campground.remove({}, function(error, campgorunds) {
        if (!error) {
            console.log("Purge DB");

            //add few campgrounds
            data.forEach(function(dataItem) {
                Campground.create(dataItem, function(error, campground) {
                    if (!error) {
                        console.log(`Campground ${campground.name} inserted`);

                        //create comment
                        Comment.create({
                            text: "No Wi-Fi!",
                            author: "Cartman"
                        }, function(error, comment) {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created new comment");
                        });
                    }
                    else {
                        console.log(error);
                    }
                })
            });
        }
        else {
            console.log(error);
        }
    });
}

module.exports = seedDB;

var express= require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({encoded:true}));

//SCHEMA

var campgroundSchema = new mongoose.Schema({
    name:String,
    image:String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

app.get("/", function(req, res){
    res.render("landingPage");
});

//INDEX
app.get("/campgrounds", function(req, res){
    Campground.find({},function(error, items){
        if(!error){
            console.log(`Campgorunds retrieved ${items}`)
            res.render("campgrounds", {campgrounds:items});
        }else{
            console.log("Retrieve error!");
        }
    });  
});

//NEW
app.get("/campgrounds/new", function(req, res){
    res.render("newcampground");
});

//CREATE
app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var imgURL = req.body.imgURL;
    var description = req.body.description;
    
    var newCampground ={name: name, image: imgURL, description: description};
    
    Campground.create(newCampground, function(error, item){
        if(!error){
            console.log(`Campgorund ${item.name} saved.`)
            res.redirect("/campgrounds");
        }else{
            console.log("Save error!");
        }
    });
});

//SHOW
app.get("/campgrounds/:id", function(req, res){
    var campgroundId = req.params.id;
    
    Campground.findById(campgroundId,function(error, item){
        if(!error){
            console.log(`Campgorund ${item.name} found.`)
            res.render("show", {campground:item});
        }else{
            console.log("Save error!");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function (){
    console.log(`Server started at ${process.env.IP}:${process.env.PORT}`);
});
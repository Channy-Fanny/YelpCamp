var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');
var request = require("request");
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  weatherApiKey: process.env.OPENWEATHERMAP_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//Index Route
router.get("/", (req, res) => {
	Campground.find({}, (err, allCampgrounds) => {
		if (err){
			console.log(err);
		} else {
			res.render ("campgrounds/index", {campgrounds:allCampgrounds, page: "campgrounds"});
		}	
	});
});

//Create Route
router.post("/", middleware.isLoggedIn, (req, res) => {
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image.replace(/\s/g, "").split(";");
	var desc = req.sanitize(req.body.description);
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	geocoder.geocode(req.body.location, function (err, data) {
		if (err || !data.length) {
		  req.flash('error', 'Invalid address');
		  return res.redirect('back');
		}
		var lat = data[0].latitude;
		var lng = data[0].longitude;
		var location = data[0].formattedAddress;
		var newCampground = {name: name, price: price, image: image, description: desc, author: author, location: location, lat: lat, lng: lng};
		Campground.create(newCampground, (err, newlyCreated) => {
			if(err){
				console.log(err);
			} else {
				res.redirect("/campgrounds");
			}
		});
	});
});

//New Route
router.get("/new", middleware.isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
});

//Show Route
router.get("/:id", (req, res) => {
	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
		if(err || !foundCampground){
			req.flash("error", "Campground not found");
			res.redirect("back");
	 	} else {
			coord_API_endpoint = "http://api.openweathermap.org/data/2.5/weather?";
			lat_long = "lat=" + foundCampground.lat.toString() + "&lon=" + foundCampground.lng.toString();
			join_key = "&appid=" + options.weatherApiKey;
			current_coord_weather_url= coord_API_endpoint + lat_long + join_key;
			request(current_coord_weather_url, (error, response, body) =>{
				if (!error && response.statusCode == 200){
					var data = JSON.parse(body);
					res.render("campgrounds/show", {campground: foundCampground, data: data});
				}
			});	
		}
	});
});

//Edit Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//Update Route
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	geocoder.geocode(req.body.location, function (err, data) {
		if (err || !data.length) {
		  req.flash('error', 'Invalid address');
		  return res.redirect('back');
		}
		req.body.campground.lat = data[0].latitude;
		req.body.campground.lng = data[0].longitude;
		req.body.campground.location = data[0].formattedAddress;
		req.body.campground.description = req.sanitize(req.body.campground.description);
		req.body.campground.image = req.body.campground.image.replace(/\s/g, "").split(";");
		Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
			if(err){
				res.redirect("/campgrounds");
			} else {
				res.redirect("/campgrounds/" + req.params.id);
			}
		});
	});
});

//Destroy Route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
		if(err){
			res.redirect("/campgrounds");
		} else {
			Comment.deleteMany({_id: {$in: campgroundRemoved.comments}}, (err) => {
				if(err){
					res.redirect("/campgrounds");
				} else {
					res.redirect("/campgrounds");
				}
			});
		}	
	});
});

module.exports = router;
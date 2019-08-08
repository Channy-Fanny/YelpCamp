var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
	{
		name: "Cloud's Rest",
		image:"https://pixabay.com/get/57e2d54b4852ad14f6da8c7dda793f7f1636dfe2564c704c732b7edc9644cc5a_340.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ultrices dapibus eros nec tempor. Integer lobortis elementum quam eu scelerisque. Sed efficitur nunc non elit commodo, commodo imperdiet mi pretium. Nulla quis diam sed magna bibendum feugiat eu faucibus diam. Proin sed feugiat lorem. Nullam ut mauris sit amet ligula finibus tempor. Phasellus a congue eros, non euismod tortor. Suspendisse consequat dui quis metus egestas, vel rhoncus turpis gravida."
	},
	{
		name: "Desert Mesa",
		image:"https://pixabay.com/get/50e9d4474856b108f5d084609620367d1c3ed9e04e50744f712a73d59e44c7_340.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ultrices dapibus eros nec tempor. Integer lobortis elementum quam eu scelerisque. Sed efficitur nunc non elit commodo, commodo imperdiet mi pretium. Nulla quis diam sed magna bibendum feugiat eu faucibus diam. Proin sed feugiat lorem. Nullam ut mauris sit amet ligula finibus tempor. Phasellus a congue eros, non euismod tortor. Suspendisse consequat dui quis metus egestas, vel rhoncus turpis gravida."
	},
	{
		name: "Canyon Floor",
		image:"https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c732b7edc9644cc5a_340.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ultrices dapibus eros nec tempor. Integer lobortis elementum quam eu scelerisque. Sed efficitur nunc non elit commodo, commodo imperdiet mi pretium. Nulla quis diam sed magna bibendum feugiat eu faucibus diam. Proin sed feugiat lorem. Nullam ut mauris sit amet ligula finibus tempor. Phasellus a congue eros, non euismod tortor. Suspendisse consequat dui quis metus egestas, vel rhoncus turpis gravida."
	}
];

function seedDB(){
	//Remove all campgrounds
	Campground.deleteMany({}, (err) => {
		if(err){
			console.log(err);
		}
		console.log("removed campgrounds!");
		Comment.deleteMany({}, (err) => {
		if(err){
			console.log(err);
		}
		console.log("removed comments!");
			//add a few campgrounds
			data.forEach((seed) => {
				Campground.create(seed, (err, campground) => {
					if(err){
						console.log(err);
					} else {
						console.log("added a campground");
						//create a comment
						Comment.create(
							{
								text: "This place is great, but I wish there was internet",
								author: "Homer"
							}, (err, comment) => {
								if(err) {
									console.log(err);
								} else {
									campground.comments.push(comment);
									campground.save();
									console.log("created new comment");
								}
							});
					}
				});
			});
		});
	});
	
	//add a few comments
}

module.exports = seedDB;
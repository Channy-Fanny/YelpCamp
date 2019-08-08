var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//Root Route
router.get("/", (req, res) => {
	res.render("landing");
});

//Show Register Form Route
router.get("/register", (req, res) => {
	res.render("register", {page: "register"});
});

//Handle Sign Up Logic
router.post("/register", (req, res) => {
	User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
		if(err){
			return res.render("register", {"error": err.message});
		}
		passport.authenticate("local")(req, res, () => {
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

//Show Login Form
router.get("/login", (req, res) => {
	res.render("login", {page: "login"});
});

//Handling Login Logic
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "login",
		failureFlash: true
	}), (req, res) => {
});

//Logout Route
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});

module.exports = router;
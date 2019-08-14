require('dotenv').config();

const express       = require("express"),
	  app           = express (),
      bodyParser    = require("body-parser"),
      mongoose      = require("mongoose"),
	  flash			= require("connect-flash"),
	  passport      = require("passport"),
	  LocalStrategy = require("passport-local"),
	  methodOverride = require("method-override"),
	  expressSanitizer = require("express-sanitizer"),
	  Campground    = require("./models/campground"),
	  Comment       = require("./models/comment"),
	  User			= require("./models/user"),
	  seedDB        = require("./seeds");

//Requring Routes
var commentRoutes 	 = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes		 = require("./routes/index");

mongoose.connect(process.env.databaseURL, {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log("Connected to DB!");
}).catch(err => {
	console.log("ERROR:", err.message);
});

mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //Seed The Database

app.locals.moment = require('moment');

//Passport Configuration
app.use(require("express-session")({
	secret: "Some random text goes here",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("The YelpCamp Server has started!!!");
});

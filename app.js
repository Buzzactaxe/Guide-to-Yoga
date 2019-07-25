var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	School = require('./models/yogaPost'),
	Comment = require('./models/comments'),
	User = require('./models/user'),
	seedsDB = require('./seeds');

mongoose.connect('mongodb://localhost/yoga_guide', {
	useNewUrlParser: true
});

app.use(
	bodyParser.urlencoded({
		extended: true
	})
);
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
// seedsDB();

// PASSPORT CONFIGURATION
app.use(
	require('express-session')({
		secret: 'Sometimes you need some help to find the right path.',
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

app.get('/', function (req, res) {
	res.render('landing');
});

//INDEX - Frontend displaying yoga Schools
app.get('/yoga_schools', function (req, res) {
	//get schools from db
	School.find({}, function (err, allSchools) {
		if (err) {
			console.log(err);
		} else {
			res.render('yogaSchools/index', {
				school: allSchools,
				currentUser: req.user
			});
		}
	});
});

//Backend CREATE - logic to add new yoga school
app.post('/yoga_schools', function (req, res) {
	// get the data from form and add to "school" array
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newSchool = {
		name: name,
		image: image,
		description: description
	};
	//Create new School and save to DB
	School.create(newSchool, function (err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/yoga_schools');
		}
	});
});

//Frontend NEW - shows form for user to add New yoga school
app.get('/yoga_schools/new', isLoggedIn, function (req, res) {
	res.render('yogaSchools/new');
});

//SHOW - Fronted shows info about singular yoga school
app.get('/yoga_schools/:id', function (req, res) {
	//find school with that id
	School.findById(req.params.id).populate('comments').exec(function (err, foundSchool) {
		if (err) {
			console.log(err);
		} else {
			//show the id data to the url
			res.render('yogaSchools/show', {
				school: foundSchool
			});
		}
	});
});

//=====
//COMMENTS ROUTE
//=====

//Frontend NEW comment- shows form for user to add New comment
app.get('/yoga_schools/:id/comments/new', isLoggedIn, function (req, res) {
	School.findById(req.params.id, function (err, school) {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', {
				school: school
			});
		}
	});
});

//Backend CREATE comment- logic to add new comment connected to a single school
app.post('/yoga_schools/:id/comments', isLoggedIn, function (req, res) {
	School.findById(req.params.id, function (err, school) {
		if (err) {
			console.log(err);
			res.redirect('/yoga_schools');
		} else {
			Comment.create(req.body.comment, function (err, comment) {
				if (err) {
					console.log(err);
				} else {
					school.comments.push(comment);
					school.save();
					res.redirect('/yoga_schools/' + school._id);
				}
			});
		}
	});
});

//=====
//AUTH ROUTE
//=====

app.get('/register', function (req, res) {
	res.render('register');
});

//handles signup logic
app.post('/register', function (req, res) {
	var newUser = new User({
		username: req.body.username
	});
	User.register(newUser, req.body.password, function (err, user) {
		if (err) {
			console.log(err);
			return res.render('register');
		}
		passport.authenticate('local')(req, res, function () {
			res.redirect('/yoga_schools');
		});
	});
});

//Show login form
app.get('/login', function (req, res) {
	res.render('login');
});

//hadles login logic
app.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/yoga_schools',
		failureRedirect: '/login'
	}),
	function (req, res) {
		res.send('login route');
	}
);

//logout route
app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/yoga_schools');
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

//Listening to server
app.listen(3000, function () {
	console.log('Blog Server is Running and all is well!');
});
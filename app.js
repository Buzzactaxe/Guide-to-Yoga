var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	School = require('./models/yogaPost');

mongoose.connect('mongodb://localhost/yoga_guide', {
	useNewUrlParser: true
});

app.use(
	bodyParser.urlencoded({
		extended: true
	})
);
app.set('view engine', 'ejs');


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

			res.render('index', {
				school: allSchools
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
app.get('/yoga_schools/new', function (req, res) {
	res.render('new');
});

//SHOW - Fronted shows info about singular yoga school
app.get('/yoga_schools/:id', function (req, res) {
	//find school with that id
	School.findById(req.params.id, function (err, foundSchool) {
		if (err) {
			console.log(err);
		} else {
			//show the id data to the url
			res.render("show", {
				school: foundSchool
			});
		}
	});
});

//Listening to server
app.listen(3000, function () {
	console.log('Blog Server is Running and all is well!');
});
var mongoose = require("mongoose");
var School = require("./models/yogaPost");
var Comment = require("./models/comments");

var data = [{
        name: "Stretching Rest School",
        image: "https://images.unsplash.com/photo-1507120410856-1f35574c3b45?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa School",
        image: "https://images.unsplash.com/photo-1463214551910-9d4d4e4ee844?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor Studio",
        image: "https://images.unsplash.com/photo-1551656941-dc4f2593028b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]

function seedDB() {
    //Remove all schools
    School.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("removed yoga schools!");
        Comment.remove({}, function (err) {
            if (err) {
                console.log(err);
            }
            console.log("removed comments!");
            //add a few schools
            data.forEach(function (seed) {
                School.create(seed, function (err, school) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("added a school");
                        //create a comment
                        Comment.create({
                            text: "This place is great, but the price is pretty high",
                            author: "McGuiver"
                        }, function (err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                school.comments.push(comment);
                                school.save();
                                console.log("Created new comment");
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
var mongoose = require("mongoose");
var SchoolSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    created: {
        type: Date,
        default: Date.now
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

module.exports = mongoose.model("School", SchoolSchema);
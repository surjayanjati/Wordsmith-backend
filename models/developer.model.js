// this file will contain the chema of the user model

const mongoose = require("mongoose");

const developerSchema = new mongoose.Schema({
    title : {
        type : String,
        require : true
    },
    images : {
        type : [String],
        require : true,
    }
});


module.exports = mongoose.model("Developer",developerSchema);
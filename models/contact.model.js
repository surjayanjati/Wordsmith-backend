// this file will contain the chema of the user model

const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    email : {
        type : String,
        require : true,
        lowercase : true
    },
    phone : {
        type : String,
        require : true
    },
    type : {
        type : String,
        require : true,
    },
    massage : {
        type : String,
        require : true,
    },
    status : {
        type : String,
        require : true,
        default : "PENDING"
    },
    remarks : {
        type : String,
        require : true,
        default : ""
    },
});


module.exports = mongoose.model("Contact",contactSchema);
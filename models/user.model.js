// this file will contain the chema of the user model

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    email : {
        type : String,
        unique : true,
        require : true,
        minLenght : 10,
        lowercase : true
    },
    phone : {
        type : String,
        require : true
    },
    password : {
        type : String,
        require : true
    },
    userType : {
        type : String,
        require : true,
        default : "USER"
    },
    createdAt : {
        type : Date,
        default : () =>{
            return Date.now()
        },
        immutable : true
    },
    updatedAt : {
        type : Date,
        default : () =>{
            return Date.now()
        }
    }
});


module.exports = mongoose.model("User",userSchema);
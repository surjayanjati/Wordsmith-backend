// this file will contain the chema of the user model

const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
    title : {
        type : String,
        require : true
    },
    price : {
        type : String,
        require : true,
    },
    images : {
        type : [String],
        require : true,
    },
    description : {
        type : String,
        require : true
    },
    address : {
        type : String,
        require : true
    },
    country : {
        type : String,
        require : true
    },
    state : {
        type : String,
        require : true
    },
    city : {
        type : String,
        require : true
    },
    area : {
        type : String,
        require : true
    },
    videoLink : {
        type : String,
        require : true
    },
    amenities : {
        type : [String],
        require : true
    },
    useCase : {
        type : String,
        require : true
    },
    builderType : {
        type : String,
        require : true
    },
    propertyType : {
        type : String,
        require : true
    },
    rooms : {
        type : Number,
        default : 0
    },
    bedRooms : {
        type : Number,
        default : 0
    },
    bathRooms : {
        type : Number,
        default : 0
    },
    garages : {
        type : Number,
        default : 0
    },
    basements : {
        type : Number,
        default : 0
    },
    propertyArea : {
        type : Number,
        require : true
    },
    pricing : {
        type : String,
        require : true
    },
    status : {
        type : String,
        require : true
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
    },
    createdBy : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : "User"
    },
    isActive : {
        type : String,
        require : true,
        default : "PENDING"
    },
});


module.exports = mongoose.model("Property",propertySchema);
const property = require("../models/property.model");
const fileDelete = require("../utils/deletefiles");
const User = require("../models/user.model");
/**
 * Create a function to allow the admin to create a property
 *  ==> There is no user validation later only admin will be able to create property
 *  ==> If user is admin or not will be taken care by the middleware
 *
 * when a user calls the endpoint:
 *
 * POST wordsmithrealty/api/v1/properties  , router should call the below method
 */
exports.createProperty = async (req, res) => {
  // logic to handle the property creation 

  try {
    // First Read the req body and create the Js object to be inserted in the DB
    const propertyObj = {
      title: req.body.title,
      price: req.body.price,
      images: [],
      description: req.body.description,
      address: req.body.address,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      area: req.body.area,
      videoLink: req.body.videoLink,
      amenities: req.body.amenities,
      useCase: req.body.useCase,
      builderType: req.body.builderType,
      propertyType: req.body.propertyType,
      propertyArea: req.body.propertyArea,
      pricing: req.body.pricing,
      status: req.body.status,
      createdBy: req.userId
    };
    if (req.body.useCase == 'Residental') {
      propertyObj.rooms = req.body.rooms;
      propertyObj.bedRooms = req.body.bedRooms;
      propertyObj.bathRooms = req.body.bathRooms;
    } else if (req.body.useCase == 'Commercial') {
      propertyObj.garages = req.body.garages;
      propertyObj.basements = req.body.basements;
    }
    const creatingUser = await User.findById(req.userId);
    if (!creatingUser) {
      return res.status(500).send({
        message: "Some internal server error",
        status: 500
      });
    }
    console.log(creatingUser)
    if (creatingUser.userType == "ADMIN") {
      propertyObj.isActive = "ACTIVE"
    } else {
      propertyObj.isActive = "PENDING"
    }
    req.files.forEach(element => {
      propertyObj.images.push(element.filename);
    });

    console.log(propertyObj);


    // Insert the data in the database
    const savedProperty = await property.create(propertyObj);

    /**
     * Return the success response to the customer
     */
    res.status(200).send({ savedProperty, massage: "Property created successfully", status: 200 });
  } catch (err) {
    console.log("Error while creating Property ", err.message);
    res.status(500).send({
      message: "Some internal server error",
      status: 500
    });
  }
};

exports.getProperties = async (req, res) => {
  try {
    const queryObj = {};
    if (req.query.id) {
      queryObj._id = req.query.id;
    }
    if (req.query.useCase) {
      queryObj.useCase = req.query.useCase;
    }
    if (req.query.builderType) {
      queryObj.builderType = req.query.builderType;
    }
    if (req.query.propertyType) {
      queryObj.propertyType = req.query.propertyType;
    }
    if (req.query.pricing) {
      queryObj.isActive = "ACTIVE";
      if (req.query.pricing == 'Both') {
        queryObj.pricing = { $in: ['Sell', 'Rent'] }
      } else {
        queryObj.pricing = req.query.pricing;
      }
    }
    if (req.query.keyword) {
      const keyword = req.query.keyword;
      queryObj.$or = [{ title: RegExp(keyword, 'i') }, { city: RegExp(keyword, 'i') }, { state: RegExp(keyword, 'i') }, { country: RegExp(keyword, 'i') }, { address: RegExp(keyword, 'i') }, { area: RegExp(keyword, 'i') }];
    }
    if (req.query.status) {
      queryObj.status = req.query.status;
    }

    

    console.log(queryObj);
    const allProperties = await property.find(queryObj);
    res.status(200).send({ allProperties, message: "Successfully fetched all properties", status: 200 });
  } catch (err) {
    console.log("Error while fetching properties ", err.message);
    res.status(500).send({
      message: "Some internal server error",
      status: 500
    });
  }
}

exports.getUserProperties = async (req, res) => {
  try {
    const queryObj = {};
    if (req.query.pricing) {
      if (req.query.pricing == 'Both') {
        queryObj.pricing = { $in: ['Sell', 'Rent'] }
      } else {
        queryObj.pricing = req.query.pricing;
      }
    }
    // We have to check if the request is coming from admin or other user
    // user will be able to see all properties and user will be able to see what he have uploaded.
    const requestingUser = await User.findById(req.userId);
    if (!requestingUser) {
      return res.status(500).send({
        message: "Some internal server error",
        status: 500
      });
    }
    if (requestingUser.userType != "ADMIN") {
      queryObj.createdBy = req.userId
    }


    console.log(queryObj);
    const allProperties = await property.find(queryObj);
    res.status(200).send({ allProperties, message: "Successfully fetched all properties", status: 200 });
  } catch (err) {
    console.log("Error while fetching properties ", err.message);
    res.status(500).send({
      message: "Some internal server error",
      status: 500
    });
  }
}

exports.deleteProperties = async (req, res) => {
  try {
    const propertyId = req.params.id;

    const toBedeleted = await property.findById(propertyId);
    if (!toBedeleted) {
      return res.status(404).send({
        message: "Property with the given id to be deleted is not found",
      });
    }

    const queryObj = {
      _id: toBedeleted._id
    };
    const deleteObj = await property.deleteOne(queryObj);
    if (!deleteObj) {
      return res.status(500).send({
        message: "Some internal server error",
        status: 500
      });
    }
    toBedeleted.images.forEach(element => {
      fileDelete.deleteFile('properties/' + element);
    });
    res.status(200).send({ toBedeleted, message: "Successfully deleted the property", status: 200 });
  } catch (err) {
    console.log("Error while fetching properties ", err.message);
    res.status(500).send({
      message: "Some internal server error",
      status: 500
    });
  }
}

exports.updateProperties = async (req, res) => {
  try {
    const propertyId = req.params.id;
    console.log(req.params.id);
    const propertyTobeUpdate = await property.findById(propertyId);
    if (!propertyTobeUpdate) {
      return res.status(404).send({
        message: "Property with the given id to be updated is not found",
      });
    }

    propertyTobeUpdate.title = req.body.title ? req.body.title : propertyTobeUpdate.title;
    propertyTobeUpdate.price = req.body.price ? req.body.price : propertyTobeUpdate.price;
    propertyTobeUpdate.description = req.body.description ? req.body.description : propertyTobeUpdate.description;
    propertyTobeUpdate.address = req.body.address ? req.body.address : propertyTobeUpdate.address;
    propertyTobeUpdate.country = req.body.country ? req.body.country : propertyTobeUpdate.country;
    propertyTobeUpdate.state = req.body.state ? req.body.state : propertyTobeUpdate.state;
    propertyTobeUpdate.city = req.body.city ? req.body.city : propertyTobeUpdate.city;
    propertyTobeUpdate.area = req.body.area ? req.body.area : propertyTobeUpdate.area;
    propertyTobeUpdate.videoLink = req.body.videoLink ? req.body.videoLink : propertyTobeUpdate.videoLink;
    propertyTobeUpdate.amenities = req.body.amenities ? req.body.amenities : propertyTobeUpdate.amenities;
    propertyTobeUpdate.useCase = req.body.useCase ? req.body.useCase : propertyTobeUpdate.useCase;
    propertyTobeUpdate.builderType = req.body.builderType ? req.body.builderType : propertyTobeUpdate.builderType;
    propertyTobeUpdate.propertyType = req.body.propertyType ? req.body.propertyType : propertyTobeUpdate.propertyType;
    propertyTobeUpdate.rooms = req.body.rooms ? req.body.rooms : propertyTobeUpdate.rooms;
    propertyTobeUpdate.bedRooms = req.body.bedRooms ? req.body.bedRooms : propertyTobeUpdate.bedRooms;
    propertyTobeUpdate.bathRooms = req.body.bathRooms ? req.body.bathRooms : propertyTobeUpdate.bathRooms;
    propertyTobeUpdate.garages = req.body.garages ? req.body.garages : propertyTobeUpdate.garages;
    propertyTobeUpdate.basements = req.body.basements ? req.body.basements : propertyTobeUpdate.basements;
    propertyTobeUpdate.propertyArea = req.body.propertyArea ? req.body.propertyArea : propertyTobeUpdate.propertyArea;
    propertyTobeUpdate.pricing = req.body.pricing ? req.body.pricing : propertyTobeUpdate.pricing;
    propertyTobeUpdate.status = req.body.status ? req.body.status : propertyTobeUpdate.status;
    propertyTobeUpdate.isActive = req.body.isActive ? req.body.isActive : propertyTobeUpdate.isActive;

    if (req.body.oldimages && req.body.oldimages[0]=="null") {
      propertyTobeUpdate.images.forEach((element) => {
        fileDelete.deleteFile('properties/' + element);
      });
      propertyTobeUpdate.images = [];
    } else {
      if(req.body.oldimages){
        propertyTobeUpdate.images.forEach((element) => {
          if (req.body.oldimages.indexOf(element) == -1) {
            propertyTobeUpdate.images.splice(req.body.oldimages.indexOf(element), 1)
            fileDelete.deleteFile('properties/' + element);
          }
        });
      }
      
    }

    if (req.files) {
      req.files.forEach(element => {
        propertyTobeUpdate.images.push(element.filename);
      });
    }


    const updatedProperty = await propertyTobeUpdate.save();
    res.status(200).send({ updatedProperty, message: "Successfully updated the property", status: 200 });
  } catch (err) {
    console.log("Error while updating properties ", err.message);
    res.status(500).send({
      message: "Some internal server error",
      status: 500
    });
  }
}
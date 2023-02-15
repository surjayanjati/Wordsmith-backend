const developer = require("../models/developer.model");
const fileDelete = require("../utils/deletefiles");
/**
 * Create a function to allow the admin to create a Developer
 *  ==> There is no user validation, later only admin will be able to create Developer
 *  ==> If user is admin or not will be taken care by the middleware
 *
 * when a user calls the endpoint:
 *
 * POST wordsmithrealty/api/v1/developers  , router should call the below method
 */
exports.createDeveloper = async (req, res) => {
  // logic to handle the property creation 

  try {
    // First Read the req body and create the Js object to be inserted in the DB
    const developerObj = {
      title: req.body.title,
      images: [],
    };
    req.files.forEach(element => {
        developerObj.images.push(element.filename);
    });

    console.log(developerObj);


    // Insert the data in the database
    const savedDeveloper = await developer.create(developerObj);

    /**
     * Return the success response to the customer
     */
    res.status(200).send({ savedDeveloper, massage: "Developer created successfully", status: 200 });
  } catch (err) {
    console.log("Error while creating Developer ", err.message);
    res.status(500).send({
      message: "Some internal server error",
      status: 500
    });
  }
};

exports.getDevelopers = async (req, res) => {
  try {
    const allDevelopers = await developer.find({});
    res.status(200).send({allDevelopers,message: "Successfully fetched all Developers",status: 200});
  } catch (err) {
    console.log("Error while fetching Developers ", err.message);
    res.status(500).send({
      message: "Some internal server error",
      status: 500
    });
  }
}

exports.deleteDevelopers = async (req, res) => {
  try {
    const developersId = req.params.id;

    const toBedeleted = await developer.findById(developersId);
    if (!toBedeleted) {
      return res.status(404).send({
        message: "Developer with the given id to be deleted is not found",
      });
    }

    const queryObj = {
      _id: toBedeleted._id
    };
    const deleteObj = await developer.deleteOne(queryObj);
    if (!deleteObj) {
      return res.status(500).send({
        message: "Some internal server error",
        status: 500
      });
    }
    toBedeleted.images.forEach(element => {
      fileDelete.deleteFile('developers/' + element);
    });
    res.status(200).send({ toBedeleted, message: "Successfully deleted the Developer", status: 200 });
  } catch (err) {
    console.log("Error while fetching Developers ", err.message);
    res.status(500).send({
      message: "Some internal server error",
      status: 500
    });
  }
}
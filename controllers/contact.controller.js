const contact = require("../models/contact.model");

const nodemailer = require("nodemailer");

/**
 * Create a function to allow the admin to create a Developer
 *  ==> There is no user validation, later only admin will be able to create Developer
 *  ==> If user is admin or not will be taken care by the middleware
 *
 * when a user calls the endpoint:
 *
 * POST wordsmithrealty/api/v1/contacts  , router should call the below method
 */
exports.createContacts = async (req, res) => {
  // logic to handle the property creation 

  try {
    // First Read the req body and create the Js object to be inserted in the DB
    const contactObj = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      type: req.body.type,
      massage: req.body.massage
    };
    console.log(contactObj);

    // Insert the data in the database
    const savedcontact = await contact.create(contactObj);

    const emailTransporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: "wordsmithrealty2022@gmail.com",
        pass: 'hsqxkoxnidxbllek'
      },
      secure: true
    });
    const body = `
                  name: ${req.body.name} \n
                  email: ${req.body.email} \n
                  phone: ${req.body.phone} \n
                  type: ${req.body.type} \n
                  massage: ${req.body.massage}`;
    const mailObj = {
      to: 'wordsmithrealty@gmail.com',
      subject: 'Contact From The Front End',
      text: body
    }
    
    emailTransporter.sendMail(mailObj, async (err, info) => {
      if (err) {
        console.log("Error in sending email ", err.message);
      } else {
        console.log("Email was sent successfully");
      }
    });

    const mailObj2 = {
      to: 'wordsmithrealty25@gmail.com',
      subject: 'Contact From The Front End',
      text: body
    }
    emailTransporter.sendMail(mailObj2, async (err, info) => {
      if (err) {
        console.log("Error in sending email ", err.message);
      } else {
        console.log("Email was sent successfully");
      }
    });

    /**
     * Return the success response to the customer
     */
    res.status(200).send({ savedcontact, massage: "Contact created successfully", status: 200 });
  } catch (err) {
    console.log("Error while creating Contact ", err.message);
    res.status(500).send({
      message: "Some internal server error",
      status: 500
    });
  }
};

exports.geContacts = async (req, res) => {
  try {
    const allContact = await contact.find({});
    res.status(200).send({ allContact, message: "Successfully fetched all Contact", status: 200 });
  } catch (err) {
    console.log("Error while fetching Contacts ", err.message);
    res.status(500).send({
      message: "Some internal server error",
      status: 500
    });
  }
}

exports.deleteContacts = async (req, res) => {
  try {
    const contactId = req.params.id;

    const toBedeleted = await contact.findById(contactId);
    if (!toBedeleted) {
      return res.status(404).send({
        message: "Contact details with the given id to be deleted is not found",
      });
    }

    const queryObj = {
      _id: toBedeleted._id
    };
    const deleteObj = await contact.deleteOne(queryObj);
    if (!deleteObj) {
      return res.status(500).send({
        message: "Some internal server error",
        status: 500
      });
    }
    res.status(200).send({ toBedeleted, message: "Successfully deleted the Contact", status: 200 });
  } catch (err) {
    console.log("Error while fetching properties ", err.message);
    res.status(500).send({
      message: "Some internal server error",
      status: 500
    });
  }
}

exports.updateContacts = async (req, res) => {
  try {
    // Fetch the user object if it is present
    const contactId = req.params.id;
    console.log(req.body)
    const contactTobeUpdate = await contact.findById(contactId);

    if (!contactTobeUpdate) {
      return res.status(404).send({
        message: "Contact Submit with the given id to be updated is not found",
      });
    }

    /**
     * Update the contact object based on the request
     */
    contactTobeUpdate.name = req.body.name ? req.body.name : contactTobeUpdate.name;
    contactTobeUpdate.email = req.body.email ? req.body.email : contactTobeUpdate.email;
    contactTobeUpdate.phone = req.body.phone ? req.body.phone : contactTobeUpdate.phone;
    contactTobeUpdate.type = req.body.type ? req.body.type : contactTobeUpdate.type;
    contactTobeUpdate.massage = req.body.massage ? req.body.massage : contactTobeUpdate.massage;
    contactTobeUpdate.status = req.body.status ? req.body.status : contactTobeUpdate.status;
    contactTobeUpdate.remarks = req.body.remarks ? req.body.remarks : contactTobeUpdate.remarks;

    /**
     * Save the contact object and return the updated object
     */
    const updatedContact = await contactTobeUpdate.save();

    res.status(200).send({ updatedContact, message: "Successfully update the Contact", status: 200 });

  } catch {
    res.status(500).send({
      message: "Some internal server error",
    });
  }
};
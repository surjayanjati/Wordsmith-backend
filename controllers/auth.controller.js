// this file have the logic to signup and signin the users

const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const authconfig = require("../configs/auth.config");

/**
 * Create a function to allow the user to signup
 *
 * when a user calls the endpoint:
 *
 * POST crm/api/v1/auth/signup  , router should call the below method
 */
exports.signup = async (req, res) => {
  // logic to handle the signup

  try {
    // First Read the req body and create the Js object to be inserted in the DB

    const userObj = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: bcrypt.hashSync(req.body.password, 8),
    };

    // Insert the data in the database
    const savedUser = await User.create(userObj);

    const postResponse = {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      phone: savedUser.phone,
      userType: savedUser.userType,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };

    /**
     * Return the success response to the customer
     */
    res.status(200).send({data:postResponse,status:200});
  } catch (err) {
    console.log("Error while registering user ", err.message);
    res.status(500).send({
      message: "Some internal server error",
      status:500
    });
  }
};

/**
 * Create a function to allow the user to signin
 *
 * when a user calls the endpoint:
 *
 * POST crm/api/v1/auth/signin  , router should call the below method
 */
exports.signin = async (req, res) => {
  try {
    // read the userId and password from the request
    const emailFromReq = req.body.email;
    const passwordFromReq = req.body.password;

    // Ensure the userId is valid
    const userSaved = await User.findOne({ email: emailFromReq });

    if (!userSaved) {
      return res.status(401).send({
        message: "Email given is not correct",
      });
    }

    // Ensure password mathes
    // Req paword is in plain string
    // Database password is hashed
    // So we compare using the bcrypt
    const isValidPassword = bcrypt.compareSync(
      passwordFromReq,
      userSaved.password
    );

    if (!isValidPassword) {
      return res.status(401).send({
        message: "Incorrect password",
      });
    }

    // We generate the access token (JWT based)
    const token = jwt.sign(
      {
        id: userSaved._id,
      },
      authconfig.secret,
      { expiresIn: "2h" }
    );

    // send the res back
    res.status(200).send({
      status : 200,
      data:
      {
        _id : userSaved._id,
        name: userSaved.name,
        email: userSaved.email,
        phone: userSaved.phone,
        userType: userSaved.userType,
        accesstoken: token,
      }
    });
  } catch (err) {
    console.log("Error while sign in ", err.message);
    res.status(500).send({
      message: "Some internal server error",
      status:500
    });
  }
};


exports.makeAdmin = async (req, res) => {
  // logic to handle the signup

  try {
    // First Read the req body and create the Js object to be inserted in the DB

    const userObj = {
      name: "Admin",
      email: "admin@admin.com",
      phone: "9830377088",
      password: bcrypt.hashSync("Admin@1234", 8),
      userType: "ADMIN"
    };

    // Insert the data in the database
    const savedUser = await User.create(userObj);

    const postResponse = {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      phone: savedUser.phone,
      userType: savedUser.userType,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };

    /**
     * Return the success response to the customer
     */
    res.status(200).send({data:postResponse,status:200});
  } catch (err) {
    console.log("Error while registering user ", err.message);
    res.status(500).send({
      message: "Some internal server error",
      status:500
    });
  }
};
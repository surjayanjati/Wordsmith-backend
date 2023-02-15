const jwt = require("jsonwebtoken");
const authconfig = require("../configs/auth.config");
const User = require("../models/user.model");
const property = require("../models/property.model");
// Middleware to validate the access token

const verifytoken = (req, res, next) => {
  // if the token is present
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).send({
      message: "Token is missing",
    });
  }

  // if the token is valid
  jwt.verify(token, authconfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Invalid Token",
      });
    }
    // Fatch the userId from the token and set it to the request object
    req.userId = decoded.id;
    next();
  });
};

// Middleware to check if user is admin or not
const isAdmin = async (req, res, next) => {
  try {
    const userObj = await User.findOne({ _id: req.userId });
    if (userObj && userObj.userType == "ADMIN") {
      next();
    } else {
      return res.status(403).send({
        message: "Only ADMIN is Allowed",
      });
    }
  } catch {
    console.log("Error while checking if isAdmin ", err.message);
    res.status(500).send({
      message: "Some internal server error",
    });
  }
};

// Middleware to check if user is admin or owner
const isAdminOrOwner = async (req, res, next) => {
  const callingUser = await User.findOne({ _id: req.userId });

  const propertyTobeUpdate = await property.findById(req.params.id);

  console.log(callingUser.userType);
  console.log(callingUser._id);
  console.log(propertyTobeUpdate.createdBy);
  console.log(callingUser._id.equals(propertyTobeUpdate.createdBy));

  if (callingUser.userType == "ADMIN" || callingUser._id.equals(propertyTobeUpdate.createdBy)) {
    if (req.body.isActive && callingUser.userType != "ADMIN") {
      return res.status(403).send({
        message: "Only ADMIN is allowed to change Status",
      });
    }
    next();
  } else {
    return res.status(403).send({
      message: "Only ADMIN and USER are authorized",
    });
  }
};
module.exports = {
  verifytoken: verifytoken,
  isAdmin: isAdmin,
  isAdminOrOwner: isAdminOrOwner,
};

const auth = require("../middlewares/authjwt");
const propertyController = require("../controllers/property.controller");
const fileConfig = require("../configs/file.config");
const multer = require("multer");
const storeImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, fileConfig.propertyUrl)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  }
})
const upload = multer({ storage: storeImage })

module.exports = (app) => {
  /**
  * Define the route to create a property
  * 
  * POST wordsmithrealty/api/v1/properties -> property controller createProperty method
  */
  app.post("/wordsmithrealty/api/v1/properties", [auth.verifytoken,upload.any('images')], propertyController.createProperty);

  /**
  * Define the route to get list of properties
  * 
  * GET wordsmithrealty/api/v1/properties -> property controller getProperties method
  */
  app.get("/wordsmithrealty/api/v1/properties", propertyController.getProperties);


   /**
  * Define the route to get list of properties for a specific user
  * 
  * GET wordsmithrealty/api/v1/users/:id/properties -> property controller getProperties method
  */
    app.get("/wordsmithrealty/api/v1/users/properties",[auth.verifytoken], propertyController.getUserProperties);

  /**
  * Define the route to delete properties
  * 
  * DELETE wordsmithrealty/api/v1/properties/:id -> property controller deleteProperties method
  */
  app.delete("/wordsmithrealty/api/v1/properties/:id",[auth.verifytoken,auth.isAdmin], propertyController.deleteProperties);

  /**
  * Define the route to update properties
  * 
  * DELETE wordsmithrealty/api/v1/properties/:id -> property controller updateProperties method
  */
  app.put("/wordsmithrealty/api/v1/properties/:id",[auth.verifytoken,auth.isAdminOrOwner, upload.any('newimages')], propertyController.updateProperties);
}
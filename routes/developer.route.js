const auth = require("../middlewares/authjwt");
const developerController = require("../controllers/developer.controller");
const fileConfig = require("../configs/file.config");
const multer = require("multer");
const storeImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, fileConfig.developerUrl)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  }
})
const upload = multer({ storage: storeImage })

module.exports = (app) => {
  /**
  * Define the route to create a developer
  * 
  * POST wordsmithrealty/api/v1/developers -> developer controller createDeveloper method
  */
  app.post("/wordsmithrealty/api/v1/developers", upload.any('images'), developerController.createDeveloper);

  /**
  * Define the route to get list of developers
  * 
  * POST wordsmithrealty/api/v1/developers -> developer controller getDevelopers method
  */
  app.get("/wordsmithrealty/api/v1/developers", developerController.getDevelopers);

   /**
  * Define the route to delete developers
  * 
  * DELETE wordsmithrealty/api/v1/developers/:id -> developer controller deleteDevelopers method
  */
    app.delete("/wordsmithrealty/api/v1/developers/:id",[auth.verifytoken,auth.isAdmin], developerController.deleteDevelopers);
}
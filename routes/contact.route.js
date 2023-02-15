const contactController = require("../controllers/contact.controller");

module.exports = (app) => {
  /**
  * Define the route to create a contact
  * 
  * POST wordsmithrealty/api/v1/contacts -> contact controller createContacts method
  */
  app.post("/wordsmithrealty/api/v1/contacts", contactController.createContacts);

  /**
  * Define the route to get list of contacts
  * 
  * POST wordsmithrealty/api/v1/contacts -> contact controller geContacts method
  */
  app.get("/wordsmithrealty/api/v1/contacts", contactController.geContacts);

  /**
  * Define the route to delete contacts
  * 
  * POST wordsmithrealty/api/v1/contacts/:id -> contact controller deleteContacts method
  */
  app.delete("/wordsmithrealty/api/v1/contacts/:id", contactController.deleteContacts);

  /**
  * Define the route to update contacts
  * 
  * POST wordsmithrealty/api/v1/contacts/:id -> contact controller updateContacts method
  */
   app.put("/wordsmithrealty/api/v1/contacts/:id", contactController.updateContacts);
}
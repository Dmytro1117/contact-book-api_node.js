const express = require("express");
const {
  allContacts,
  contactById,
  addOneContact,
  updateContactById,
  updateFavorite,
  deleteContactsById,
} = require("../controllers/contactsControllers");
const validateJoyWrapper = require("../decorators/validateJoyWrapper");
const authenticate = require("../middlewares/authenticate");
const isValidId = require("../middlewares/isValidId");
const {
  contactsAddJoi,
  contactUpdateJoi,
  contactFavoriteJoi,
} = require("../schemas/contactsJoiSchemas");

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", allContacts);

contactsRouter.get("/:contactId", isValidId, contactById);

contactsRouter.post("/", validateJoyWrapper(contactsAddJoi), addOneContact);

contactsRouter.put(
  "/:contactId",
  isValidId,
  validateJoyWrapper(contactUpdateJoi),
  updateContactById
);

contactsRouter.patch(
  "/:contactId/favorite",
  isValidId,
  validateJoyWrapper(contactFavoriteJoi),
  updateFavorite
);

contactsRouter.delete("/:contactId", isValidId, deleteContactsById);

module.exports = contactsRouter;

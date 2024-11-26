const express = require("express");
const {
  allContacts,
  contactById,
  addOneContact,
  updateContactById,
  updateFavorite,
  deleteContactsById,
} = require("../controllers/contactsControllers");
const validateJoy = require("../decorators/validateJoyWrapper");
const isValidId = require("../middlewares/isValidId");
const {
  contactsAddJoi,
  contactUpdateJoi,
  contactFavoriteJoi,
} = require("../schemas/contactsJoiSchemas");

const contactsRouter = express.Router();

contactsRouter.get("/", allContacts);

contactsRouter.get("/:contactId", isValidId, contactById);

contactsRouter.post("/", validateJoy(contactsAddJoi), addOneContact);

contactsRouter.put(
  "/:contactId",
  isValidId,
  validateJoy(contactUpdateJoi),
  updateContactById
);

contactsRouter.patch(
  "/:contactId/favorite",
  isValidId,
  validateJoy(contactFavoriteJoi),
  updateFavorite
);

contactsRouter.delete("/:contactId", isValidId, deleteContactsById);

module.exports = contactsRouter;

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
const multerDownload = require("../middlewares/multerDownload");

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", allContacts);

contactsRouter.get("/:contactId", isValidId, contactById);

contactsRouter.post(
  "/",
  multerDownload.single("cover"),
  validateJoyWrapper(contactsAddJoi),
  addOneContact
);

contactsRouter.put(
  "/:contactId",
  isValidId,
  multerDownload.single("cover"),
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

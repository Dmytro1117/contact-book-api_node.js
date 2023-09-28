const express = require("express");
const {
  allContacts,
  contactById,
  addOneContact,
  updateContactById,
  updateFavorite,
  deleteContactsById,
} = require("../../controllers/ctrlContacts");
const validateContacts = require("../../middlewares/validationSchemas");
const isValidId = require("../../middlewares/isValidId");
const { joiSchema, favoriteJoiSchema } = require("../../models/contactsSchema");

const router = express.Router();

router.get("/", allContacts);

router.get("/:contactId", isValidId, contactById);

router.post("/", validateContacts(joiSchema), addOneContact);

router.put(
  "/:contactId",
  isValidId,
  validateContacts(joiSchema),
  updateContactById
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateContacts(favoriteJoiSchema),
  updateFavorite
);

router.delete("/:contactId", isValidId, deleteContactsById);

module.exports = router;

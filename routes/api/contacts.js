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
const { joiSchema, favoriteJoiSchema } = require("../../models/contactsSchema");

const router = express.Router();

router.get("/", allContacts);

router.get("/:contactId", contactById);

router.post("/", validateContacts(joiSchema), addOneContact);

router.put("/:contactId", validateContacts(joiSchema), updateContactById);

router.patch(
  "/:contactId/favorite",
  validateContacts(favoriteJoiSchema),
  updateFavorite
);

router.delete("/:contactId", deleteContactsById);

module.exports = router;

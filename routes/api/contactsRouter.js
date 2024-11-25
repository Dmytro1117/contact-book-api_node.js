const express = require("express");
const {
  allContacts,
  contactById,
  addOneContact,
  updateContactById,
  deleteContactsById,
} = require("../../controllers/ctrlContacts");
const validateContacts = require("../../middlewares/validationSchemas");
const {
  contactsPostSchema,
  contactsUpdateSchema,
} = require("../../schemas/contactsSchema");

const router = express.Router();

router.get("/", allContacts);

router.get("/:contactId", contactById);

router.post("/", validateContacts(contactsPostSchema), addOneContact);

router.put(
  "/:contactId",
  validateContacts(contactsUpdateSchema),
  updateContactById
);

router.delete("/:contactId", deleteContactsById);

module.exports = router;

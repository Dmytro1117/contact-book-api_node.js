const express = require("express");
const {
  allContacts,
  contactById,
  addOneContact,
  updateContactById,
  deleteContactsById,
} = require("../../controllers/ctrlContacts");
const validateContacts = require("../../middlewares/validationSchemas");
const { contactsSchema } = require("../../schemas/contactsSchema");

const router = express.Router();

router.get("/", allContacts);

router.get("/:contactId", contactById);

router.post("/", validateContacts(contactsSchema), addOneContact);

router.put("/:contactId", validateContacts(contactsSchema), updateContactById);

router.delete("/:contactId", deleteContactsById);

module.exports = router;

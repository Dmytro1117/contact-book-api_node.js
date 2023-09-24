const {
  listContacts,
  getContactById,
  addContact,
  updateById,
  removeContact,
} = require("../models/requestDB");
const { NotFound } = require("http-errors");
const { ctrlWrapperContacts } = require("../helpers/ctrlWrapperContacts");

const allContacts = async (req, res, next) => {
  const contacts = await listContacts();
  res.json({
    status: "succes",
    code: 200,
    data: {
      result: contacts,
    },
  });
};

const contactById = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    throw new NotFound(`Sorry, contact with contactId ${contactId} not found`);
  }
  res.json({
    status: "succes",
    code: 200,
    data: {
      contact,
    },
  });
};

const addOneContact = async (req, res, next) => {
  const addedContact = await addContact(req.body);
  res.status(201).json({
    status: "succes",
    code: 201,
    data: { addedContact },
  });
};

const updateContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const update = await updateById(contactId, req.body);
  if (!update) {
    throw new NotFound(`Sorry, contact with contactId ${contactId} not found`);
  }
  res.json({
    status: "succes",
    code: 200,
    data: { update },
  });
};

const deleteContactsById = async (req, res, next) => {
  const { contactId } = req.params;
  const delet = await removeContact(contactId);
  if (!delet) {
    throw new NotFound(`Sorry, contact with contactId ${contactId} not found`);
  }
  res.json({
    status: "succes",
    code: 200,
    message: "contact deleted",
    data: { delet },
  });
};

module.exports = {
  allContacts: ctrlWrapperContacts(allContacts),
  contactById: ctrlWrapperContacts(contactById),
  addOneContact: ctrlWrapperContacts(addOneContact),
  updateContactById: ctrlWrapperContacts(updateContactById),
  deleteContactsById: ctrlWrapperContacts(deleteContactsById),
};

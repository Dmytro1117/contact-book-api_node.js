const Contact = require("../models/Contact");
const { NotFound } = require("http-errors");
const { controllerWrapper } = require("../decorators/controllerWrapper");

const allContacts = async (req, res) => {
  const contacts = await Contact.find({}, "-createdAt -updatedAt");
  res.json({
    status: "succes",
    code: 200,
    data: {
      result: contacts,
    },
  });
};

const contactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);
  if (!contact) {
    throw new NotFound(`Sorry, contact with id=${contactId} not found`);
  }
  res.json({
    status: "succes",
    code: 200,
    data: {
      contact,
    },
  });
};

const addOneContact = async (req, res) => {
  const addedContact = await Contact.create(req.body);
  res.status(201).json({
    status: "succes",
    code: 201,
    data: { addedContact },
  });
};

const updateContactById = async (req, res) => {
  const { contactId } = req.params;
  const update = await Contact.findByIdAndUpdate(contactId, req.body);
  if (!update) {
    throw new NotFound(`Sorry, contact with id=${contactId} not found`);
  }
  res.json({
    status: "succes",
    code: 200,
    data: { update },
  });
};

const updateFavorite = async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const update = await Contact.findByIdAndUpdate(contactId, { favorite });
  if (!update) {
    throw new NotFound(`Sorry, contact with id=${contactId} not found`);
  }
  res.json({
    status: "succes",
    code: 200,
    data: { update },
  });
};

const deleteContactsById = async (req, res, next) => {
  const { contactId } = req.params;
  const deleted = await Contact.findByIdAndDelete(contactId);
  if (!deleted) {
    throw new NotFound(`Sorry, contact with id=${contactId} not found`);
  }
  res.json({
    status: "succes",
    code: 200,
    message: "Delete success",
    data: { deleted },
  });
};

module.exports = {
  allContacts: controllerWrapper(allContacts),
  contactById: controllerWrapper(contactById),
  addOneContact: controllerWrapper(addOneContact),
  updateContactById: controllerWrapper(updateContactById),
  updateFavorite: controllerWrapper(updateFavorite),
  deleteContactsById: controllerWrapper(deleteContactsById),
};

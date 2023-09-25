const { Contact } = require("../models/contactsSchema");
const { NotFound } = require("http-errors");
const { ctrlWrapperContacts } = require("../helpers/ctrlWrapperContacts");

const allContacts = async (req, res) => {
  const contacts = await Contact.find({});
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
  const update = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!update) {
    throw new NotFound(`Sorry, contact with contactId ${contactId} not found`);
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
  const update = await Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    {
      new: true,
    }
  );
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
  const delet = await Contact.findByIdAndRemove(contactId);
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
  updateFavorite: ctrlWrapperContacts(updateFavorite),
  deleteContactsById: ctrlWrapperContacts(deleteContactsById),
};

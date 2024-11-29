const { NotFound } = require("http-errors");
const Contact = require("../models/Contact");
const { controllerWrapper } = require("../decorators/controllerWrapper");

const allContacts = async (req, res) => {
  const { page = 1, limit = 20, favorite = null } = req.query;
  const filter = {
    owner: req.user._id,
  };
  const skip = (page - 1) * limit;
  if (favorite !== null) filter.favorite = favorite;
  const contacts = await Contact.find(filter, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "_id name email");
  res.json({
    status: "succes",
    code: 200,
    data: {
      contacts,
    },
  });
};

const contactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId).populate(
    "owner",
    "_id name email"
  );
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
  const { _id: owner } = req.user;
  const contact = await Contact.create({ ...req.body, owner });
  const addedContact = await Contact.findById(contact._id).populate(
    "owner",
    "_id name email"
  );
  res.status(201).json({
    status: "succes",
    code: 201,
    data: { addedContact },
  });
};

const updateContactById = async (req, res) => {
  const { contactId } = req.params;
  const update = await Contact.findByIdAndUpdate(contactId, req.body).populate(
    "owner",
    "_id name email"
  );
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
  const updatedFavorite = await Contact.findByIdAndUpdate(contactId, {
    favorite,
  }).populate("owner", "_id name email");
  if (!updatedFavorite) {
    throw new NotFound(`Sorry, contact with id=${contactId} not found`);
  }
  res.json({
    status: "succes",
    code: 200,
    data: { updatedFavorite },
  });
};

const deleteContactsById = async (req, res, next) => {
  const { contactId } = req.params;
  const deleted = await Contact.findByIdAndDelete(contactId).populate(
    "owner",
    "_id name email"
  );
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

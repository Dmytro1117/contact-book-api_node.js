const { NotFound } = require("http-errors");
const Contact = require("../models/Contact");
const { controllerWrapper } = require("../decorators/controllerWrapper");
const cloudinaryDownload = require("../helpers/cloudinaryDownload");

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
    status: "Succes",
    code: 200,
    contacts,
  });
};

const contactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(
    contactId,
    "-createdAt -updatedAt"
  ).populate("owner", "_id name email");
  if (!contact) {
    throw new NotFound(`Sorry, contact with id=${contactId} not found`);
  }
  res.json({
    status: "Succes",
    code: 200,
    contact,
  });
};

const addOneContact = async (req, res) => {
  const { _id: owner } = req.user;

  let cover = null;

  if (req.file) {
    cover = await cloudinaryDownload(req.file, "contacts", [
      { width: 250, height: 250 },
    ]);
  }

  const contact = await Contact.create({ ...req.body, cover, owner });
  const addedContact = await Contact.findById(
    contact._id,
    "-createdAt -updatedAt"
  ).populate("owner", "_id name email");

  res.status(201).json({
    status: "Created",
    code: 201,
    addedContact,
  });
};

const updateContactById = async (req, res) => {
  const { contactId } = req.params;

  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw new NotFound(`Sorry, contact with id=${contactId} not found`);
  }

  let { cover } = await Contact.findById(contactId);

  if (req.file) {
    cover = await cloudinaryDownload(req.file, "contacts", [
      { width: 250, height: 250 },
    ]);
  }

  const updateContact = await Contact.findByIdAndUpdate(contactId, {
    ...req.body,
    cover,
  })
    .select("-createdAt -updatedAt")
    .populate("owner", "_id name email");
  if (!updateContact) {
    throw new NotFound(`Sorry, contact with id=${contactId} not found`);
  }
  res.json({
    status: "Success",
    code: 200,
    updateContact,
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
    status: "Succes",
    code: 200,
    updatedFavorite,
  });
};

const deleteContactById = async (req, res) => {
  const { contactId } = req.params;

  const deletedContact = await Contact.findByIdAndDelete(contactId)
    .select("-createdAt -updatedAt")
    .populate("owner", "_id name email");
  if (!deletedContact) {
    throw new NotFound(`Sorry, contact with id=${contactId} not found`);
  }
  res.json({
    status: "Succes",
    code: 200,
    message: "Delete success",
    deletedContact,
  });
};

module.exports = {
  allContacts: controllerWrapper(allContacts),
  contactById: controllerWrapper(contactById),
  addOneContact: controllerWrapper(addOneContact),
  updateContactById: controllerWrapper(updateContactById),
  updateFavorite: controllerWrapper(updateFavorite),
  deleteContactById: controllerWrapper(deleteContactById),
};

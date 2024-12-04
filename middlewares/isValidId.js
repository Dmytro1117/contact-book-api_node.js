const { isValidObjectId } = require("mongoose");
const { NotFound } = require("http-errors");

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    next(NotFound(`Sorry, ${contactId} is not valid id.`));
  }
  next();
};

module.exports = isValidId;

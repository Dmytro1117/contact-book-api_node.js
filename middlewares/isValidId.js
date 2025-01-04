const { isValidObjectId } = require("mongoose");
const { BadRequest } = require("http-errors");

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    next(BadRequest(`Sorry, ${contactId} is not valid id.`));
  }
  next();
};

module.exports = isValidId;

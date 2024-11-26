const Joi = require("joi");
const dateRegexp = require("../constants/contactsConstants");

const contactsAddJoi = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "name must be exist",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "email must be exist",
  }),
  phone: Joi.string().required().pattern(dateRegexp).messages({
    "any.required": "phone must be exist",
  }),
  favorite: Joi.boolean(),
});

const contactUpdateJoi = Joi.object()
  .min(1)
  .keys({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string().pattern(dateRegexp),
    favorite: Joi.boolean(),
  })
  .messages({
    "object.min": "body must have at least one update field.",
  });

const contactFavoriteJoi = Joi.object({
  favorite: Joi.bool().required(),
});

module.exports = {
  contactsAddJoi,
  contactUpdateJoi,
  contactFavoriteJoi,
};

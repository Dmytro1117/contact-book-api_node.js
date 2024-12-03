const Joi = require("joi");
const { phoneRegexp } = require("../constants/constant");

const contactsAddJoi = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "enter name",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "enter email",
  }),
  phone: Joi.string().required().pattern(phoneRegexp).messages({
    "any.required": "enter phone",
  }),
  favorite: Joi.boolean(),
});

const contactUpdateJoi = Joi.object()
  .min(1)
  .keys({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string().pattern(phoneRegexp),
  })
  .messages({
    "object.min":
      "body must have at least one update field (name or email or phone)",
    "object.unknown": "enter the available fields (name, email, phone)",
  });

const contactFavoriteJoi = Joi.object({
  favorite: Joi.bool().required().messages({
    "any.required": "сhange field",
  }),
});

module.exports = {
  contactsAddJoi,
  contactUpdateJoi,
  contactFavoriteJoi,
};

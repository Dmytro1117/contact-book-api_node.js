const Joi = require("joi");

const contactsPostSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "The name field is required.",
    "any.required": "The name field must be provided.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "The email must be a valid email address.",
    "string.empty": "The email field is required.",
    "any.required": "The email field must be provided.",
  }),
  phone: Joi.string().required().messages({
    "string.empty": "The phone field is required.",
    "any.required": "The phone field must be provided.",
  }),
});

const contactsUpdateSchema = Joi.object()
  .min(1)
  .keys({
    name: Joi.string(),
    email: Joi.string().email().messages({
      "string.email": "The email must be a valid email address.",
    }),
    phone: Joi.string(),
  })
  .messages({
    "object.min": "Body must have at least one field.",
  });

module.exports = {
  contactsPostSchema,
  contactsUpdateSchema,
};

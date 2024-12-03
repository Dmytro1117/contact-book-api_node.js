const Joi = require("joi");
const { emailRegexp, typeSubscription } = require("../constants/constant");

const registerJoiSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "enter name (must be exist)",
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "enter email (must be exist)",
  }),
  password: Joi.string().min(10).required().messages({
    "any.required": "enter password (must be exist)",
  }),
});

const verifyJoiSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "send email",
  }),
});

const loginJoiSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "enter mail",
  }),
  password: Joi.string().min(10).required().messages({
    "any.required": "enter password",
  }),
});

const subscriptionJoiSchema = Joi.object({
  subscription: Joi.string()
    .valid(...typeSubscription)
    .required(),
});

module.exports = {
  registerJoiSchema,
  verifyJoiSchema,
  loginJoiSchema,
  subscriptionJoiSchema,
};

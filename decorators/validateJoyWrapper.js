const { BadRequest } = require("http-errors");

const validateJoyWrapper = (joiSchema) => {
  const func = (req, res, next) => {
    const { error } = joiSchema.validate(req.body);

    if (error) {
      throw new BadRequest(`Please, ${error.message}`);
    }
    next();
  };

  return func;
};

module.exports = validateJoyWrapper;

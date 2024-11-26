const { BadRequest } = require("http-errors");

const validateJoy = (joiSchema) => {
  const func = (req, res, next) => {
    const { error } = joiSchema.validate(req.body);

    if (error) {
      throw new BadRequest(`Sorry, ${error.message}`);
    }
    next();
  };

  return func;
};

module.exports = validateJoy;

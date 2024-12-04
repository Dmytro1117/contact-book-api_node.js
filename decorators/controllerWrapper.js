const fs = require("fs/promises");

const controllerWrapper = (controller) => {
  const func = async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      if (req.file) {
        fs.unlink(req.file.path);
      }

      next(error);
    }
  };

  return func;
};

module.exports = { controllerWrapper };

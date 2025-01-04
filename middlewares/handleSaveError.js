const handleSaveError = (error, data, next) => {
  const { name, code } = error;

  if (name === "ValidationError") {
    error.message = Object.values(error.errors)
      .map((err) => err.message)
      .join(", ");
    error.status = 400;
  } else if (name === "MongoServerError" && code === 11000) {
    error.message = "Duplicate key error";
    error.status = 409;
  } else {
    error.status = 400;
  }

  next(error);
};

module.exports = { handleSaveError };

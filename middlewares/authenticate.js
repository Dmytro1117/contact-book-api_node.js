const Unauthorized = require("http-errors");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(Unauthorized(401, "Authorization header not found"));
  }
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return next(Unauthorized(401, "Bearer not found"));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);

    const user = await User.findById(id);

    if (!user) {
      return next(Unauthorized(401, "User not found"));
    }

    if (!user.token || user.token !== token) {
      return next(Unauthorized(401, "User alredy logout"));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(Unauthorized(401, `Invalid sugnature (${error.message})`));
  }
};

module.exports = authenticate;

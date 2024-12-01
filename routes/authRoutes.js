const express = require("express");
const validateJoyWrapper = require("../decorators/validateJoyWrapper");
const {
  register,
  login,
  curent,
  logout,
  updateSubscription,
  updateAvatar,
} = require("../controllers/authControllers");
const authenticate = require("../middlewares/authenticate");
const multerDownload = require("../middlewares/multerDownload");

const {
  registerJoiSchema,
  loginJoiSchema,
  subscriptionJoiSchema,
} = require("../schemas/authJoiSchemas");

const authRouter = express.Router();

authRouter.post("/register", validateJoyWrapper(registerJoiSchema), register);
authRouter.post("/login", validateJoyWrapper(loginJoiSchema), login);
authRouter.get("/current", authenticate, curent);
authRouter.post("/logout", authenticate, logout);
authRouter.patch(
  "/",
  authenticate,
  validateJoyWrapper(subscriptionJoiSchema),
  updateSubscription
);
authRouter.patch(
  "/avatars",
  authenticate,
  multerDownload.single("avatar"),
  updateAvatar
);

module.exports = authRouter;

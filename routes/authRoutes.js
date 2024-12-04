const express = require("express");
const validateJoyWrapper = require("../decorators/validateJoyWrapper");
const {
  register,
  verifyEmail,
  resendVerifyEmail,
  login,
  curent,
  logout,
  updateSubscription,
  updateAvatar,
} = require("../controllers/authControllers");
const authenticate = require("../middlewares/authenticate");
const {
  registerJoiSchema,
  verifyJoiSchema,
  loginJoiSchema,
  subscriptionJoiSchema,
} = require("../schemas/authJoiSchemas");
const multerDownload = require("../middlewares/multerDownload");

const authRouter = express.Router();

authRouter.post(
  "/register",
  multerDownload.single("avatar"),
  validateJoyWrapper(registerJoiSchema),
  register
);
authRouter.get("/verify/:verificationToken", verifyEmail);
authRouter.post(
  "/verify",
  validateJoyWrapper(verifyJoiSchema),
  resendVerifyEmail
);
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

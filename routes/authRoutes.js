const express = require("express");
const validateJoyWrapper = require("../decorators/validateJoyWrapper");
const {
  register,
  verifyEmail,
  resendVerifyEmail,
  login,
  curent,
  logout,
} = require("../controllers/authControllers");
const authenticate = require("../middlewares/authenticate");
const multerDownload = require("../middlewares/multerDownload");

const {
  registerJoiSchema,
  verifyJoiSchema,
  loginJoiSchema,
} = require("../schemas/authJoiSchemas");

const authRouter = express.Router();

authRouter.post(
  "/register",
  multerDownload.single("avatar"),
  validateJoyWrapper(registerJoiSchema),
  register
);
authRouter.get("/verify/:verificationToken", verifyEmail);
authRouter.post(
  "/verify/resend-email",
  validateJoyWrapper(verifyJoiSchema),
  resendVerifyEmail
);
authRouter.post("/login", validateJoyWrapper(loginJoiSchema), login);
authRouter.get("/current", authenticate, curent);
authRouter.post("/logout", authenticate, logout);

module.exports = authRouter;

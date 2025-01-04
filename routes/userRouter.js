const express = require("express");
const validateJoyWrapper = require("../decorators/validateJoyWrapper");
const {
  updateSubscription,
  updateAvatar,
} = require("../controllers/userControllers");
const authenticate = require("../middlewares/authenticate");
const multerDownload = require("../middlewares/multerDownload");

const { subscriptionJoiSchema } = require("../schemas/authJoiSchemas");

const userRouter = express.Router();

userRouter.use(authenticate);

userRouter.patch(
  "/subscription",
  authenticate,
  validateJoyWrapper(subscriptionJoiSchema),
  updateSubscription
);
userRouter.patch(
  "/avatars",
  authenticate,
  multerDownload.single("avatar"),
  updateAvatar
);

module.exports = userRouter;

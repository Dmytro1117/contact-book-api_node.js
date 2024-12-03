const { NotFound, BadRequest } = require("http-errors");
const createErrorUnauthorized = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const shortid = require("shortid");
const { sendVerifyEmail } = require("../helpers/sendVerifyEmail");
const User = require("../models/User");
const cloudinaryDownload = require("../helpers/cloudinaryDownload");
const { verifycationLetter } = require("../helpers/verifycationLetter");
const { controllerWrapper } = require("../decorators/controllerWrapper");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { name, email, password, subscription } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw new createErrorUnauthorized(
      409,
      `Sorry, user with email ${email} in use`
    );
  }

  let avatar = null;

  if (req.file) {
    avatar = await cloudinaryDownload(req.file, "avatars", [
      { width: 250, height: 350 },
    ]);
  } else {
    avatar = gravatar.url(email);
  }

  const verificationToken = shortid.generate();

  const hashPassword = await bcrypt.hash(password, 10);

  await User.create({
    ...req.body,
    password: hashPassword,
    avatar,
    verificationToken,
  });

  const verifyEmail = verifycationLetter({ email, verificationToken });

  await sendVerifyEmail(verifyEmail);

  res.status(201).json({
    status: "succes",
    code: 201,
    data: {
      user: {
        email,
        name,
        avatar,
      },
    },
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw NotFound("Verification user not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.json({
    status: "succes",
    code: 200,
    data: {
      message: "Verification successful",
    },
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw BadRequest("User not found");
  }
  if (user.verify) {
    throw BadRequest("Verification has already been passed");
  }

  const verifyEmail = verifycationLetter({
    email,
    verificationToken: user.verificationToken,
  });

  await sendVerifyEmail(verifyEmail);

  res.json({
    status: "succes",
    code: 200,
    data: {
      message: "Verify email send success",
    },
  });
};

const login = async (req, res) => {
  const { email, password = "" } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new createErrorUnauthorized(401, `Sorry, email is wrong`);
  }

  if (!user.verify) {
    throw new createErrorUnauthorized(401, "Email not verified");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare || password === "") {
    throw new createErrorUnauthorized(401, `Sorry, password is wrong`);
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "5h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    status: "succes",
    code: 200,
    data: {
      token,
    },
  });
};

const curent = async (req, res) => {
  const { name, email, subscription } = req.user;
  res.json({
    status: "succes",
    code: 200,
    data: {
      user: {
        name,
        email,
        subscription,
      },
    },
  });
};

const logout = async (req, res) => {
  const { _id, name } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    status: "succes",
    code: 204,
    data: { message: `Logout ${name} success` },
  });
};

const updateSubscription = async (req, res) => {
  const { _id, name } = req.user;
  const { subscription } = req.body;
  const update = await User.findByIdAndUpdate(_id, { subscription });
  if (!update) {
    throw new NotFound(`Sorry, not found`);
  }

  res.status(200).json({
    status: "success",
    code: 200,
    data: {
      message: `Subscription ${name} change on ${subscription} success`,
    },
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  if (!req.file) {
    throw new BadRequest(`Please, input file`);
  }

  const avatar = await cloudinaryDownload(req.file, "avatars", [
    { width: 250, height: 350 },
  ]);

  await User.findByIdAndUpdate(_id, { avatar });

  res.json({
    status: "succes",
    code: 200,
    data: { avatar },
  });
};

module.exports = {
  register: controllerWrapper(register),
  verifyEmail: controllerWrapper(verifyEmail),
  resendVerifyEmail: controllerWrapper(resendVerifyEmail),
  login: controllerWrapper(login),
  curent: controllerWrapper(curent),
  logout: controllerWrapper(logout),
  updateSubscription: controllerWrapper(updateSubscription),
  updateAvatar: controllerWrapper(updateAvatar),
};

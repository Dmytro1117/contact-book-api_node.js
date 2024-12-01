const Conflict = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const User = require("../models/User");
const { controllerWrapper } = require("../decorators/controllerWrapper");

const { SECRET_KEY } = process.env;

const avatarsPath = path.resolve("public", "avatars");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw new Conflict(409, `Sorry, user with email ${email} in use`);
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  await User.create({ ...req.body, password: hashPassword, avatarURL });

  res.status(201).json({
    status: "succes",
    code: 201,
    data: {
      user: {
        email,
        name,
      },
    },
  });
};

const login = async (req, res) => {
  const { email, password = "" } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Conflict(401, `Sorry, email or password is wrong`);
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare || password === "") {
    throw new Conflict(401, `Sorry, email or password is wrong`);
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
    throw new Conflict(`Sorry, not found`);
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
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);

  await fs.rename(oldPath, newPath);
  const image = await Jimp.read(newPath);
  image.resize(250, 250).write(newPath);

  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    status: "succes",
    code: 200,
    data: { avatarURL },
  });
};

module.exports = {
  register: controllerWrapper(register),
  login: controllerWrapper(login),
  curent: controllerWrapper(curent),
  logout: controllerWrapper(logout),
  updateSubscription: controllerWrapper(updateSubscription),
  updateAvatar: controllerWrapper(updateAvatar),
};

const { User } = require("../models/userModel");
const { ctrlWrapperRoutes } = require("../helpers/ctrlWrapperRoutes");
const Conflict = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict(409, `Sorry, user with  ${email} in use`);
  }

  const hashBacrypt = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const avatarURL = gravatar.url(email);
  const result = await User.create({
    name,
    email,
    password: hashBacrypt,
    avatarURL,
  });

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
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Conflict(401, `Sorry, user with ${email} or password is wrong`);
  }
  const passwordCompare = bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw new Conflict(401, `Sorry, user with ${email} or password is wrong`);
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
  const { name, email } = req.user;
  res.json({
    status: "succes",
    code: 200,
    data: {
      user: {
        name,
        email,
      },
    },
  });
};

const logout = async (req, res) => {
  const { _id, name } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });

  res.json({
    status: "succes",
    code: 204,
    data: { message: `Logout ${name} success` },
  });
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;

  const { subscription } = req.body;
  const update = await User.findByIdAndUpdate(
    _id,
    { subscription },
    {
      new: true,
    }
  );
  if (!update) {
    throw new Conflict(`Sorry, not found`);
  }

  res.status(200).json({
    status: "success",
    code: 200,
    data: {
      message: `Subscription change success on ${subscription}`,
    },
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const filePath = req.file.path;

  cloudinary.uploader.upload(
    filePath,
    {
      folder: "avatars",
      transformation: [{ width: 200, height: 200 }],
      allowedFormats: ["jpg", "jpeg", "png", "gif"],
    },
    async (error, result) => {
      if (error) {
        console.error("Помилка завантаження на Cloudinary:", error);
        res.status(500).json({
          status: "error",
          code: 500,
          message: "Помилка завантаження на Cloudinary",
        });
      } else {
        console.log("Завантажено на Cloudinary:", result.url);

        const avatarURL = result.url;
        await User.findByIdAndUpdate(_id, { avatarURL });

        fs.unlinkSync(filePath);

        res.json({
          status: "success",
          code: 200,
          data: { avatarURL },
        });
      }
    }
  );
};

module.exports = {
  register: ctrlWrapperRoutes(register),
  login: ctrlWrapperRoutes(login),
  curent: ctrlWrapperRoutes(curent),
  logout: ctrlWrapperRoutes(logout),
  updateSubscription: ctrlWrapperRoutes(updateSubscription),
  updateAvatar: ctrlWrapperRoutes(updateAvatar),
};

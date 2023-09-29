const { User } = require("../models/userModel");
const { ctrlWrapperRoutes } = require("../helpers/ctrlWrapperRoutes");
const Conflict = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict(409, `Sorry, user with  ${email} in use`);
  }

  const hashBacrypt = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const result = await User.create({ name, email, password: hashBacrypt });

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

module.exports = {
  register: ctrlWrapperRoutes(register),
  login: ctrlWrapperRoutes(login),
  curent: ctrlWrapperRoutes(curent),
  logout: ctrlWrapperRoutes(logout),
  updateSubscription: ctrlWrapperRoutes(updateSubscription),
};

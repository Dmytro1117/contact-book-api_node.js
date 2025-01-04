const { NotFound, BadRequest } = require("http-errors");
const User = require("../models/User");
const cloudinaryDownload = require("../helpers/cloudinaryDownload");
const { controllerWrapper } = require("../decorators/controllerWrapper");

const updateSubscription = async (req, res) => {
  const { _id, name } = req.user;
  const { subscription } = req.body;

  const update = await User.findByIdAndUpdate(_id, { subscription });

  if (!update) {
    throw new NotFound(`Sorry, not found`);
  }

  res.status(200).json({
    status: "Success",
    code: 200,
    message: `Subscription ${name} change on ${subscription} success`,
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
    status: "Succes",
    code: 200,
    avatar,
  });
};

module.exports = {
  updateSubscription: controllerWrapper(updateSubscription),
  updateAvatar: controllerWrapper(updateAvatar),
};

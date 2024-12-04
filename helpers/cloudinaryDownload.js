const fs = require("fs/promises");
const cloudinary = require("./cloudinaryConfig");

const cloudinaryDownload = async (file, folder, transformation) => {
  const filePath = file.path;

  const { url: avatar } = await cloudinary.uploader.upload(filePath, {
    folder,
    transformation,
    allowedFormats: ["jpg", "jpeg", "png", "gif"],
  });
  await fs.unlink(filePath);
  return avatar;
};

module.exports = cloudinaryDownload;

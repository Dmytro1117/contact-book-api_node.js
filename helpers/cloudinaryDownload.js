const cloudinary = require("cloudinary").v2;
const fs = require("fs/promises");

const { CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
});

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

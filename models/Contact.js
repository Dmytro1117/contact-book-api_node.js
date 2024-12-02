const { Schema, model } = require("mongoose");
const { handleSaveError } = require("../middlewares/handleSaveError");
const { setUpdateOptions } = require("../helpers/setUpdateOptions");
const { phoneRegexp, emailRegexp } = require("../constants/constant");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      match: [emailRegexp, "Email is invalid"],
      required: [true, "Email is required"],
    },
    phone: {
      type: String,
      match: [phoneRegexp, "Phone number is invalid"],
      required: [true, "Phone is required"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    cover: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleSaveError);

contactSchema.pre("findOneAndUpdate", setUpdateOptions);

contactSchema.post("findOneAndUpdate", handleSaveError);

const Contact = model("contact", contactSchema);

module.exports = Contact;

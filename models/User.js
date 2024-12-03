const { Schema, model } = require("mongoose");
const { handleSaveError } = require("../middlewares/handleSaveError");
const { setUpdateOptions } = require("../helpers/setUpdateOptions");
const { emailRegexp, typeSubscription } = require("../constants/constant");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [10, "Password must be at least 10 characters long"],
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: typeSubscription,
      default: "starter",
    },
    token: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", setUpdateOptions);

userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);

module.exports = User;

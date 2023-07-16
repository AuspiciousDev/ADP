const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new Schema(
  {
    imgURL: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      lowercase: true,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
      lowercase: true,
    },
    gender: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    refreshToken: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", schema);

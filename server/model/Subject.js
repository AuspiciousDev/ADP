const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    subjectID: {
      type: String,
      required: true,
      lowercase: true,
    },
    levelID: {
      type: String,
      required: true,
    },

    strandID: {
      type: String,
      default: "",
    },
    subjectName: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Subject", userSchema);

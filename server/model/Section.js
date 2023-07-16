const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    sectionID: {
      type: String,
      required: true,
      lowercase: true,
    },
    depID: {
      type: String,
      required: true,
    },
    levelID: {
      type: String,
      required: true,
    },
    strandID: {
      type: String,
      default: "",
    },
    sectionName: {
      type: String,
      required: true,
      lowercase: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Section", userSchema);

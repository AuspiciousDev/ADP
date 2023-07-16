const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    strandID: {
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
    strandName: {
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

module.exports = mongoose.model("Strand", userSchema);

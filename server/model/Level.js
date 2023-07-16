const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    levelID: {
      type: String,
      required: true,
    },
    levelNum: {
      type: Number,
      required: true,
    },
    depID: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Level", userSchema);

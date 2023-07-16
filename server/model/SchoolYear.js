const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new Schema(
  {
    schoolYearID: {
      type: String,
      required: true,
    },
    schoolYear: {
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
module.exports = mongoose.model("SchoolYear", schema);

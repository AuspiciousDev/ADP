const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    empID: {
      type: Number,
      required: true,
    },

    empType: {
      type: String,
      required: true,
    },

    subjectLoads: [
      {
        type: String,
      },
    ],
    levelLoads: [
      {
        type: String,
      },
    ],
    sectionLoads: [
      {
        type: String,
      },
    ],
    status: {
      type: Boolean,
      default: true,
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
    suffix: {
      type: String,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", schema);

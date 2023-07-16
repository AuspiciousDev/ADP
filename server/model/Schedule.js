const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    scheduleID: {
      type: String,
      required: true,
    },
    depID: {
      type: String,
      required: true,
    },
    schoolYearID: {
      type: String,
      required: true,
    },
    levelID: {
      type: String,
      required: true,
    },
    term: {
      type: String,
      required: true,
    },
    strandID: {
      type: String,
    },
    sectionID: {
      type: String,
      required: true,
    },
    adviserID: String,
    adviserName: String,

    schedule: [
      {
        subjectID: {
          type: String,
          required: true,
        },
        subjectName: {
          type: String,
          required: true,
        },
        teacherID: {
          type: String,
        },
        teacherName: {
          type: String,
        },
        timeStart: {
          type: String,
          required: true,
        },
        timeEnd: {
          type: String,
          required: true,
        },
        day: {
          type: String,
          required: true,
        },
      },
    ],
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Schedule", userSchema);

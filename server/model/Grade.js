const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    gradeID: {
      type: String,
      required: true,
    },
    studID: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    subjectID: {
      type: String,
      required: true,
    },
    schoolYearID: {
      type: String,
      required: true,
    },
    grades: [
      {
        quarter: {
          type: Number,
        },
        grade: {
          type: Number,
        },
      },
    ],
    finalGrade: {
      type: Number,
    },
    rating: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Grade", userSchema);

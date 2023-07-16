const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    LRN: {
      type: String,
      required: true,
    },
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

    dateOfBirth: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    placeOfBirth: {
      type: String,
      required: true,
    },
    civilStatus: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    religion: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
    },
    fatherName: {
      type: String,
    },
    fatherContact: {
      type: String,
    },
    motherName: {
      type: String,
    },
    motherContact: {
      type: String,
    },
    emergencyName: {
      type: String,
      required: true,
    },
    emergencyRelationship: {
      type: String,
      required: true,
    },
    emergencyNumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", userSchema);

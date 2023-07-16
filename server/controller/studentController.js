const Teacher = require("../model/Teacher");
const Employee = require("../model/Employee");
const Student = require("../model/Student");
const Enrolled = require("../model/Enrolled");
const isNumber = (str) => /^[0-9]*$/.test(str);
const studentController = {
  // * Create new Student
  createDoc: async (req, res) => {
    let emptyFields = [];
    try {
      // * Retrieve information from client request body
      const {
        LRN,
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        gender,
        placeOfBirth,
        civilStatus,
        nationality,
        religion,
        address,
        city,
        province,
        email,
        mobile,
        telephone,
        fatherName,
        fatherContact,
        motherName,
        motherContact,
        emergencyName,
        emergencyRelationship,
        emergencyNumber,
      } = req.body;
      // * Validation
      if (LRN?.length != 12) emptyFields.push("Student LRN must be 12 Digits!");
      if (!isNumber(LRN)) emptyFields.push("Student LRN must be a digit");
      if (!LRN) emptyFields.push("Student LRN");
      if (!firstName) emptyFields.push("First Name");
      if (!lastName) emptyFields.push("Last Name");
      if (!dateOfBirth) emptyFields.push("Date of Birth");
      if (!gender) emptyFields.push("Gender");
      if (!placeOfBirth) emptyFields.push("Place of Birth");
      if (!civilStatus) emptyFields.push("Civil Status");
      if (!nationality) emptyFields.push("Nationality");
      if (!address) emptyFields.push("Address");
      if (!city) emptyFields.push("City");
      if (!province) emptyFields.push("Province");
      if (!email) emptyFields.push("Email");
      if (!emergencyName) emptyFields.push("Emergency Name");
      if (!emergencyRelationship) emptyFields.push("Emergency Relationship");
      if (!emergencyNumber) emptyFields.push("Emergency Number");
      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });

      // * Check if the Student LRN exists in Student Collections
      const duplicate = await Student.findOne({ LRN }).exec();
      if (duplicate)
        return res.status(409).json({ message: "Duplicate Student LRN" });
      const isTeacher = await Teacher.findOne({ empID: LRN }).exec();
      if (isTeacher)
        return res.status(409).json({
          message: `Student [${LRN}] already exist in Teacher Collection!`,
        });
      // * Create an Student Object
      const docObject = {
        LRN,
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        gender,
        placeOfBirth,
        civilStatus,
        nationality,
        religion,
        address,
        city,
        province,
        email,
        mobile,
        telephone,
        fatherName,
        fatherContact,
        motherName,
        motherContact,
        emergencyName,
        emergencyRelationship,
        emergencyNumber,
      };

      const createDoc = await Student.create(docObject);
      if (!createDoc)
        return res
          .status(400)
          .json({ message: "Creating new student failed!" });
      res.status(201).json(createDoc);
    } catch (error) {
      console.log(
        "🚀 ~ file: studentController.js:55 ~ createDoc: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  // * Get all Student
  getAllDoc: async (req, res) => {
    try {
      const response = await Student.find().sort({ LRN: -1 });
      if (!response || response.length <= 0)
        return res.status(204).json({ message: "No records found!" });
      res.json(response);
    } catch (error) {
      console.log(
        "🚀 ~ file: studentController.jsx:49 ~ getAllDoc: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  // * Get an Student
  getDocByID: async (req, res) => {
    try {
      if (!req.params.LRN)
        return res.status(400).json({ message: "Student LRN is required!" });
      const LRN = req.params.LRN;
      if (!isNumber(LRN))
        return res.status(400).json({ message: "Invalid Student LRN!" });

      const doc = await Student.findOne({ LRN }).exec();
      if (!doc)
        return res.status(400).json({ message: `Student [${LRN}] not found!` });
      res.json(doc);
    } catch (error) {
      console.log(
        "🚀 ~ file: studentController.jsx:68 ~ getDocByID: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  // * Update an Student
  updateDocByID: async (req, res) => {
    try {
      if (!req.params.LRN)
        return res.status(400).json({ message: "Student LRN is required!" });
      const LRN = req.params.LRN;
      const {
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        gender,
        placeOfBirth,
        civilStatus,
        nationality,
        religion,
        address,
        city,
        province,
        email,
        mobile,
        telephone,
        fatherName,
        fatherContact,
        motherName,
        motherContact,
        emergencyName,
        emergencyRelationship,
        emergencyNumber,
      } = req.body;

      const findDoc = await Student.findOne({ LRN }).exec();
      if (!findDoc)
        return res
          .status(204)
          .json({ message: `Student [${LRN}] does not exists!` });
      const docObject = {
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        gender,
        placeOfBirth,
        civilStatus,
        nationality,
        religion,
        address,
        city,
        province,
        email,
        mobile,
        telephone,
        fatherName,
        fatherContact,
        motherName,
        motherContact,
        emergencyName,
        emergencyRelationship,
        emergencyNumber,
      };
      const update = await Student.findOneAndUpdate({ LRN }, docObject);
      if (!update)
        return res.status(400).json({ message: "Updating student failed!" });
      res.json(update);
    } catch (error) {
      console.log(
        "🚀 ~ file: studentController.jsx:80 ~ updateDocByID: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  // * Delete an Student
  deleteDocByID: async (req, res) => {
    if (!req.params.LRN)
      return res.status(400).json({ message: "Student LRN is required!" });
    try {
      const LRN = req.params.LRN;
      const doc = await Student.findOne({ LRN }).exec();
      if (!doc)
        return res
          .status(400)
          .json({ message: `Student  [${LRN}] not found!` });

      // ? Find matched Enrollments
      const findEnrollments = await Enrolled.findOne({ LRN }).exec();
      if (findEnrollments)
        return res.status(400).json({
          message: `Cannot delete Student ${LRN}, Student has an existing record/s in Enrollments Collection.`,
        });
      const deleteDoc = await doc.deleteOne({ LRN });
      res.json(deleteDoc);
    } catch (error) {
      console.log(
        "🚀 ~ file: studentController.jsx:143 ~ deleteDoc: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  // * Toggle an Student status
  toggleDocStatus: async (req, res) => {
    if (!req?.params?.LRN)
      return res.status(400).json({ message: `Student LRN is required!` });
    try {
      const LRN = req.params.LRN;
      const { status } = req.body;
      const doc = await Student.findOne({ LRN }).exec();
      if (!doc)
        return res.status(204).json({ message: `Student [${LRN}] not found!` });
      const update = await Student.findOneAndUpdate(
        { LRN },
        {
          status,
        }
      );
      if (!update) {
        return res.status(400).json({ message: "Student update failed!" });
      }
      console.log(update);
      res.status(200).json(update);
    } catch (error) {
      console.log(
        "🚀 ~ file: studentController.jsx:182 ~ toggleUserStatus: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
};
module.exports = studentController;

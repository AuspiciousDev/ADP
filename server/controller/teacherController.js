const Teacher = require("../model/Teacher");
const Schedule = require("../model/Schedule");
const Enrolled = require("../model/Enrolled");
const isNumber = (str) => /^[0-9]*$/.test(str);
const teacherController = {
  // * Create new Teacher
  createDoc: async (req, res) => {
    let emptyFields = [];
    try {
      // * Retrieve information from client request body
      const { empID, firstName, middleName, lastName, dateOfBirth, gender } =
        req.body;
      // * Validation
      if (empID?.length != 12)
        emptyFields.push("Teacher ID must be 12 Digits!");
      if (!isNumber(empID)) emptyFields.push("Teacher ID must be a digit");
      if (!empID) emptyFields.push("Teacher ID");
      if (!firstName) emptyFields.push("First Name");
      if (!lastName) emptyFields.push("Last Name");
      if (!dateOfBirth) emptyFields.push("Date of Birth");
      if (!gender) emptyFields.push("Gender");
      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });

      // * Check if the Teacher ID exists in Teacher Collections
      const duplicate = await Teacher.findOne({ empID }).exec();
      if (duplicate)
        return res.status(409).json({ message: "Duplicate Teacher empID" });

      // * Create an Teacher Object
      const docObject = {
        empID,
        firstName,
        lastName,
        middleName,
        dateOfBirth,
        gender,
      };

      const createDoc = await Teacher.create(docObject);
      if (!createDoc)
        return res
          .status(400)
          .json({ message: "Creating new Teacher failed!" });
      res.status(201).json(createDoc);
    } catch (error) {
      console.log(
        "🚀 ~ file: teacherController.js:55 ~ createDoc: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  // * Get all Teacher
  getAllDoc: async (req, res) => {
    try {
      const response = await Teacher.find().sort({ empID: -1 });
      if (!response || response.length <= 0)
        return res.status(204).json({ message: "No records found!" });
      res.json(response);
    } catch (error) {
      console.log(
        "🚀 ~ file: teacherController.jsx:49 ~ getAllDoc: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  // * Get an Teacher
  getDocByID: async (req, res) => {
    try {
      if (!req.params.empID)
        return res.status(400).json({ message: "Teacher ID is required!" });
      const empID = req.params.empID;
      if (!isNumber(empID))
        return res.status(400).json({ message: "Invalid Teacher ID!" });

      const doc = await Teacher.findOne({ empID }).exec();
      if (!doc)
        return res
          .status(400)
          .json({ message: `Teacher [${empID}] not found!` });
      res.json(doc);
    } catch (error) {
      console.log(
        "🚀 ~ file: teacherController.jsx:68 ~ getDocByID: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  // * Update an Teacher
  updateDocByID: async (req, res) => {
    try {
      if (!req.params.empID)
        return res.status(400).json({ message: "Teacher empID is required!" });
      const empID = req.params.empID;
      const { firstName, middleName, lastName, dateOfBirth, gender } = req.body;

      const findDoc = await Teacher.findOne({ empID }).exec();
      if (!findDoc)
        return res
          .status(204)
          .json({ message: `Teacher [${empID}] does not exists!` });
      const docObject = {
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        gender,
      };
      const update = await Teacher.findOneAndUpdate({ empID }, docObject);
      if (!update)
        return res.status(400).json({ message: "Updating Teacher failed!" });
    } catch (error) {
      console.log(
        "🚀 ~ file: teacherController.jsx:80 ~ updateDocByID: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  // * Delete an Teacher
  deleteDocByID: async (req, res) => {
    if (!req.params.empID)
      return res.status(400).json({ message: "Teacher ID is required!" });
    try {
      const empID = req.params.empID;
      const doc = await Teacher.findOne({ empID }).exec();
      if (!doc)
        return res
          .status(400)
          .json({ message: `Teacher [${empID}] not found!` });

      // ? Find matched Schedules
      const findSchedules = await Schedule.findOne({
        schedule: {
          $elemMatch: { teacherID: empID },
        },
      }).exec();
      if (findSchedules)
        return res.status(400).json({
          message: `Cannot delete Teacher ${empID}, Teacher has an existing record/s in Schedules Collection.`,
        });
      // ? Find matched Schedules
      const findSchedulesAdviser = await Schedule.findOne({
        schedule: {
          $elemMatch: { adviserID: empID },
        },
      }).exec();
      if (findSchedulesAdviser)
        return res.status(400).json({
          message: `Cannot delete Teacher ${empID}, Teacher has an existing record/s in Schedules Collection.`,
        });
      const deleteDoc = await doc.deleteOne({ empID });
      res.json(deleteDoc);
    } catch (error) {
      console.log(
        "🚀 ~ file: teacherController.jsx:143 ~ deleteDoc: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  // * Toggle an Teacher status
  toggleDocStatus: async (req, res) => {
    if (!req?.params?.empID)
      return res.status(400).json({ message: `Teacher ID is required!` });
    try {
      const empID = req.params.empID;
      const { status } = req.body;
      const doc = await Teacher.findOne({ empID }).exec();
      if (!doc)
        return res
          .status(204)
          .json({ message: `Teacher [${empID}] not found!` });
      const update = await Teacher.findOneAndUpdate(
        { empID },
        {
          status,
        }
      );
      if (!update) {
        return res.status(400).json({ message: "Teacher update failed!" });
      }
      console.log(update);
      res.status(200).json(update);
    } catch (error) {
      console.log(
        "🚀 ~ file: teacherController.jsx:182 ~ toggleUserStatus: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
};
module.exports = teacherController;

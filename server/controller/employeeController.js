const Employee = require("../model/Employee");
const Student = require("../model/Student");
const ROLES_LIST = require("../config/role_list");
const isNumber = (str) => /^[0-9]*$/.test(str);
const employeeController = {
  // * Create new Employee
  createDoc: async (req, res) => {
    let emptyFields = [];
    try {
      // * Retrieve information from client request body
      const { empID, empType, firstName, lastName, dateOfBirth, gender } =
        req.body;

      // * Validation
      if (empID?.length != 10)
        emptyFields.push("Employee ID must be 10 Digits!");
      if (!isNumber(empID)) emptyFields.push("Employee ID must be a digit");
      if (!empID) emptyFields.push("Employee ID");
      if (!empType) emptyFields.push("Employee Type");
      if (!ROLES_LIST.includes(empType))
        emptyFields.push("Invalid Employee Type");
      if (!firstName) emptyFields.push("First Name");
      if (!lastName) emptyFields.push("Last Name");
      if (!dateOfBirth) emptyFields.push("Date of Birth");
      if (!gender) emptyFields.push("Gender");
      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });

      // * Check if the Employee ID exists in Employee Collections
      const duplicate = await Employee.findOne({ empID }).exec();
      if (duplicate)
        return res.status(409).json({ message: "Duplicate Employee ID" });
      // * Check if the Employee ID exists in Student Collections
      const isStudent = await Student.findOne({ studID: empID }).exec();
      if (isStudent)
        return res.status(409).json({
          message: `Employee ID [${empID}] already exist in Student Collection!`,
        });
      // * Create an Employee Object
      const docObject = {
        empID,
        empType,
        firstName,
        lastName,
        dateOfBirth,
        gender,
      };

      const createDoc = await Employee.create(docObject);
      if (!createDoc)
        return res
          .status(400)
          .json({ message: "Creating new employee failed!" });
      res.status(201).json(createDoc);
    } catch (error) {
      console.log(
        "🚀 ~ file: employeeController.jsx:7 ~ createEmployee: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  // * Get all Employee
  getAllDoc: async (req, res) => {
    try {
      const response = await Employee.find().sort({ empID: -1 });
      if (!response || response.length <= 0)
        return res.status(204).json({ message: "No records found!" });
      res.json(response);
    } catch (error) {
      console.log(
        "🚀 ~ file: employeeController.jsx:49 ~ getAllDoc: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  // * Get an Employee
  getDocByID: async (req, res) => {
    try {
      if (!req.params.empID)
        return res.status(400).json({ message: "Employee ID is required!" });
      const empID = req.params.empID;
      if (!isNumber(empID))
        return res.status(400).json({ message: "Invalid Employee ID!" });

      const doc = await Employee.findOne({ empID }).exec();
      if (!doc)
        return res
          .status(400)
          .json({ message: `Employee ID [${empID}] not found!` });
      res.json(doc);
    } catch (error) {
      console.log(
        "🚀 ~ file: employeeController.jsx:68 ~ getDocByID: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  // * Update an Employee
  updateDocByID: async (req, res) => {
    try {
      if (!req.params.empID)
        return res.status(400).json({ message: "Employee ID is required!" });

      const {
        empType,
        firstName,
        middleName,
        lastName,
        suffix,
        dateOfBirth,
        placeOfBirth,
        gender,
        civilStatus,
        nationality,
        religion,
        address,
        city,
        province,
        mobile,
        telephone,
        emergencyName,
        emergencyRelationship,
        emergencyNumber,
      } = req.body;

      const findDoc = await Employee.findOne({ empID }).exec();
      if (!findDoc)
        return res
          .status(204)
          .json({ message: `Employee [${empID}] does not exists!` });
      const docObject = {
        empType,
        firstName,
        middleName,
        lastName,
        suffix,
        dateOfBirth,
        placeOfBirth,
        gender,
        civilStatus,
        nationality,
        religion,
        address,
        city,
        province,
        mobile,
        telephone,
        emergencyName,
        emergencyRelationship,
        emergencyNumber,
      };
      const update = await Employee.findOneAndUpdate({ empID }, docObject);
      if (!update)
        return res.status(400).json({ message: "Updating employee failed!" });
    } catch (error) {
      console.log(
        "🚀 ~ file: employeeController.jsx:80 ~ updateDocByID: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  // * Delete an Employee
  deleteDocByID: async (req, res) => {
    if (!req.params.empID)
      return res.status(400).json({ message: "Employee ID is required!" });
    try {
      const empID = req.params.empID;
      const doc = await Employee.findOne({ empID }).exec();
      if (!doc)
        return res
          .status(400)
          .json({ message: `Employee ID [${empID}] not found!` });
      const deleteDoc = await doc.deleteOne({ empID });
      res.json(deleteDoc);
    } catch (error) {
      console.log(
        "🚀 ~ file: employeeController.jsx:143 ~ deleteDoc: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  // * Toggle an Employee status
  toggleDocStatus: async (req, res) => {
    if (!req?.params?.empID)
      return res.status(400).json({ message: `Employee ID is required!` });
    try {
      const empID = req.params.empID;
      const { status } = req.body;
      const doc = await Employee.findOne({ empID }).exec();
      if (!doc)
        return res
          .status(204)
          .json({ message: `Employee ID [${empID}] not found!` });
      const update = await Employee.findOneAndUpdate(
        { empID },
        {
          status,
        }
      );
      if (!update) {
        return res.status(400).json({ message: "Employee update failed!" });
      }
      console.log(update);
      res.status(200).json(update);
    } catch (error) {
      console.log(
        "🚀 ~ file: employeeController.jsx:182 ~ toggleUserStatus: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
};
module.exports = employeeController;

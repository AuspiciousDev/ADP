const SchoolYear = require("../model/SchoolYear");
const Enrolled = require("../model/Enrolled");
const Schedule = require("../model/Schedule");

const schoolYearController = {
  createDoc: async (req, res) => {
    try {
      // * Retrieve information from client request body
      const { schoolYearID, schoolYear } = req.body;

      // * Validate Data if given
      if (!schoolYearID || !schoolYear) {
        return res.status(400).json({ message: "All Fields are required!" });
      }

      // * Check if the School Year ID exists in School Year
      const duplicate = await SchoolYear.findOne({ schoolYearID }).exec();
      if (duplicate)
        return res.status(409).json({ message: "Duplicate School Year ID" });

      // * Create a find active school year
      const findActive = await SchoolYear.findOne({ status: true }).exec();
      if (!findActive) {
        // * Create a School Year Object
        const docObject = { schoolYearID, schoolYear };
        const response = await SchoolYear.create(docObject);
        if (response) res.status(201).json(response);
      } else {
        res.status(400).json({
          message: `School Year ${findActive.schoolYearID} is still active!`,
        });
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: schoolYearController.jsx:24 ~ createDoc: ~ error",
        error
      );

      res.status(500).json({ message: error.message });
    }
  },
  getAllDoc: async (req, res) => {
    try {
      // * Getting all documents/data of school year and sorted by schoolyearID eg.2022, 2023, 2024, 2025...
      const doc = await SchoolYear.find().sort({ schoolYearID: 1 }).lean();

      // ? if no document was found, return http status 204(No content) and message saying no records found
      if (!doc) return res.status(204).json({ message: "No records found!" });

      // ? if message was found, return http status 200(ok) and json document/s
      res.status(200).json(doc);
    } catch (error) {
      console.log(
        "🚀 ~ file: schoolYearController.js:35 ~ getAllDoc: ~ error",
        error
      );
      // ! if something went wrong, return http status 500(Internal server error) and error message
      res.status(500).json({ message: error.message });
    }
  },
  getDocByID: async (req, res) => {
    try {
      // * checking if the request URL contains parameter schoolYearID
      if (!req.params.schoolYearID)
        return res.status(400).json({ message: "School Year ID is Required!" });
      const schoolYearID = req.params.schoolYearID;

      const findDoc = await SchoolYear.findOne({ schoolYearID }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `School Year ${schoolYearID} not found!` });
      }
      res.json(findDoc);
    } catch (error) {
      console.log(
        "🚀 ~ file: schoolYearController.js:37 ~ getDocByID: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  deleteDocByID: async (req, res) => {
    try {
      // * checking if the request URL contains parameter schoolYearID
      if (!req.params.schoolYearID)
        return res.status(400).json({ message: "School Year ID is Required!" });
      const schoolYearID = req.params.schoolYearID;
      const findDoc = await SchoolYear.findOne({ schoolYearID }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `School Year ${schoolYearID} not found!` });
      }

      // ? check if theres an existing records in Enrolled table containing schoolYearID
      const findEnrollees = await Enrolled.findOne({ schoolYearID }).exec();
      // * check if theres and existing records matching schoolYearID in Enrolled Collection/Record
      if (findEnrollees)
        return res.status(400).json({
          message: `Cannot delete Year ${schoolYearID}, School year ID has an existing record/s in Enrolled Collection.`,
        });

      // ? check if theres an existing records in Schedule table containing schoolYearID
      const findSchedules = await Schedule.findOne({ schoolYearID }).exec();
      // * check if theres and existing records matching schoolYearID in Schedule Collection/Record
      if (findSchedules)
        return res.status(400).json({
          message: `Cannot delete Year ${schoolYearID}, School year ID has an existing record/s in Schedule Collection.`,
        });

      // * if there is no match records in enrolled and schedule table, delete document
      const deleteItem = await findDoc.deleteOne({ schoolYearID });
      res.json(deleteItem);
    } catch (error) {
      console.log(
        "🚀 ~ file: schoolYearController.js:70 ~ deleteDocByID: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  toggleDocStatus: async (req, res) => {
    try {
      const { schoolYearID, status } = req.body;
      if (!schoolYearID) {
        return res.status(400).json({ message: "ID required!" });
      }
      console.log("Request : ", req.body);

      const findActive = await SchoolYear.findOne({ status: true }).exec();
      console.log("🚀 ~ file: schoolYearController.js:132 ~ toggleDocStatus: ~ findActive", findActive)
      if (!findActive) {
        const updateDoc = await SchoolYear.findOneAndUpdate(
          { schoolYearID },
          {
            status,
          }
        );
        return res.json(updateDoc);
      }
      if (findActive && findActive.schoolYearID === schoolYearID) {
        const updateDoc = await SchoolYear.findOneAndUpdate(
          { schoolYearID },
          {
            status,
          }
        );

        res.json(updateDoc);
      } else {
        res.status(400).json({
          message: `Year ${findActive?.schoolYearID} is still active!`,
        });
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: schoolyearController.js:183 ~ toggleStatusById ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },

  getDocActive: async (req, res) => {
    try {
      const findID = await SchoolYear.findOne({ status: true }).exec();
      if (!findID) {
        return res.status(400).json({ message: `No Active School Year!` });
      }
      res.json(findID);
    } catch (error) {
      req.status(500).json({ message: error.message });
    }
  },
};

module.exports = schoolYearController;

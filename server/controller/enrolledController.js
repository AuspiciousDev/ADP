const Enrolled = require("../model/Enrolled");
const Student = require("../model/Student");
const Department = require("../model/Department");
const Section = require("../model/Section");
const Level = require("../model/Level");
const isNumber = (str) => /^[0-9]*$/.test(str);
const enrolledController = {
  createDoc: async (req, res) => {
    try {
      let emptyFields = [];
      let errorFields = [];
      let findVar;
      const {
        schoolYearID,
        LRN,
        levelID,
        strandID,
        term,
        sectionID,
        depID,
        schedule,
      } = req.body;
      if (!schoolYearID) emptyFields.push("School Year ID");
      if (!LRN) emptyFields.push("LRN");
      if (!isNumber(LRN)) emptyFields.push("LRN ID must be a digit");
      if (LRN?.length != 12) emptyFields.push("Student LRN must be 12 Digits!");
      if (!levelID) emptyFields.push("Level ID");
      if (!sectionID) emptyFields.push("Section ID");
      if (!depID) emptyFields.push("Department ID");
      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });
      const findDoc = await Student.findOne({ LRN }).exec();
      if (!findDoc)
        return res
          .status(404)
          .json({ message: `Student [${LRN}] does not exists!` });
      if (findDoc.status === false)
        return res.status(409).json({ message: "Student is not Active!" });

      // * Check Department
      findVar = await Department.findOne({ depID }).exec();
      if (!findVar) errorFields.push("Invalid Department");
      if (findVar?.status === false)
        errorFields.push("Department is disabled!");

      // * Check Level
      findVar = await Level.findOne({ levelID }).exec();
      if (!findVar) errorFields.push("Invalid Level");
      if (findVar?.status === false) errorFields.push("Level is disabled!");

      // * Check Section
      findVar = await Section.findOne({ sectionID }).exec();

      if (!findVar) {
        errorFields.push("Invalid Section!");
      } else {
        if (findVar?.levelID !== levelID)
          errorFields.push("Level and Section does not match!");
      }
      if (findVar?.status === false) errorFields.push("Section is disabled!");
      if (errorFields.length > 0)
        return res
          .status(400)
          .json({ message: "Invalid Fields!", errorFields });
      const enrollmentID =
        schoolYearID +
        "_" +
        LRN +
        "-" +
        levelID +
        sectionID +
        (strandID ? "-" + strandID : "") +
        "_" +
        term;
      const findDuplicate = await Enrolled.findOne({
        enrollmentID,
      });
      if (findDuplicate)
        return res.status(400).json({
          message: `Student [${LRN}] already enrolled on year ${schoolYearID}, Level ${levelID} - Section ${sectionID}!`,
        });
      const findMoreDuplicate = await Enrolled.findOne({
        LRN,
      }).exec();

      if (findMoreDuplicate?.schoolYearID === schoolYearID)
        return res.status(400).json({
          message: `Student [${findMoreDuplicate.LRN}] already enrolled on year ${findMoreDuplicate.schoolYearID}, Level ${findMoreDuplicate.levelID} - Section ${findMoreDuplicate.sectionID}!`,
        });

      const docObject = {
        enrollmentID,
        schoolYearID,
        LRN,
        levelID,
        strandID,
        term,
        sectionID,
        depID,
        schedule,
      };
      const createDoc = await Enrolled.create(docObject);
      res.status(201).json(createDoc);
    } catch (error) {
      console.log(
        "🚀 ~ file: enrolledController.js:74 ~ createDoc: ~ error",
        error
      );

      res.status(500).json({ message: error.message });
    }
  },
  createBulkDoc: async (req, res) => {
    try {
      let emptyFields = [];
      let errorFields = [];
      let findVar;
      let totalStudents = 0;
      const {
        schoolYearID,
        levelID,
        strandID,
        term,
        sectionID,
        depID,
        schedule,
        enrollees,
      } = req.body;
      if (!schoolYearID) emptyFields.push("School Year ID");
      if (!levelID) emptyFields.push("Level ID");
      if (!sectionID) emptyFields.push("Section ID");
      if (!depID) emptyFields.push("Department ID");
      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });

      // * Check Department
      findVar = await Department.findOne({ depID }).exec();
      if (!findVar) errorFields.push("Invalid Department");
      if (findVar?.status === false)
        errorFields.push("Department is disabled!");

      // * Check Level
      findVar = await Level.findOne({ levelID }).exec();
      if (!findVar) errorFields.push("Invalid Level");
      if (findVar?.status === false) errorFields.push("Level is disabled!");

      // * Check Section
      findVar = await Section.findOne({ sectionID }).exec();

      if (!findVar) {
        errorFields.push("Invalid Section!");
      } else {
        if (findVar?.levelID !== levelID)
          errorFields.push("Level and Section does not match!");
      }
      if (findVar?.status === false) errorFields.push("Section is disabled!");
      if (errorFields.length > 0)
        return res
          .status(400)
          .json({ message: "Invalid Fields!", errorFields });

      // const enrollmentID =
      //   schoolYearID +
      //   "_" +
      //   LRN +
      //   "-" +
      //   levelID +
      //   sectionID +
      //   (strandID ? "-" + strandID : "") +
      //   "_" +
      //   term;
      let bulkTags = [];
      enrollees.forEach(async (student) => {
        totalStudents++;
        bulkTags.push({
          updateOne: {
            filter: {
              enrollmentID:
                schoolYearID +
                "_" +
                student.LRN +
                "-" +
                levelID +
                sectionID +
                (strandID ? "-" + strandID : "") +
                "_" +
                term,
            },
            update: {
              $set: {
                enrollmentID:
                  schoolYearID +
                  "_" +
                  student.LRN +
                  "-" +
                  levelID +
                  sectionID +
                  (strandID ? "-" + strandID : "") +
                  "_" +
                  term,
                schoolYearID,
                LRN: student.LRN,
                levelID,
                strandID,
                term,
                sectionID,
                depID,
                schedule,
              },
            },
            upsert: true,
          },
        });
      });
      const bulkUp = await Enrolled.bulkWrite(bulkTags);
      console.log(
        "🚀 ~ file: enrolledController.js:220 ~ createBulkDoc: ~ bulkUp:",
        bulkUp
      );

      res.status(201).json({ totalStudents });
    } catch (error) {
      console.log(
        "🚀 ~ file: enrolledController.js:239 ~ createBulkDoc: ~ error:",
        error
      );

      res.status(500).json({ message: error.message });
    }
  },
  checkIfEnrolled: async (req, res) => {
    let emptyFields = [];
    let errorFields = [];
    let findVar;
    const { schoolYearID, LRN, levelID, strandID, term, sectionID, depID } =
      req.body;
    if (!schoolYearID) emptyFields.push("School Year ID");
    if (!LRN) emptyFields.push("LRN");
    if (!isNumber(LRN)) emptyFields.push("LRN ID must be a digit");
    if (LRN?.length != 12) emptyFields.push("Student LRN must be 12 Digits!");
    if (!levelID) emptyFields.push("Level ID");
    if (!sectionID) emptyFields.push("Section ID");
    if (!depID) emptyFields.push("Department ID");
    if (emptyFields.length > 0)
      return res
        .status(400)
        .json({ message: "Please fill in all the fields", emptyFields });
    const findDoc = await Student.findOne({ LRN }).exec();
    if (!findDoc)
      return res
        .status(404)
        .json({ message: `Student [${LRN}] does not exists!` });
    if (findDoc.status === false)
      return res.status(409).json({ message: "Student is not Active!" });

    // * Check Department
    findVar = await Department.findOne({ depID }).exec();
    if (!findVar) errorFields.push("Invalid Department");
    if (findVar?.status === false) errorFields.push("Department is disabled!");

    // * Check Level
    findVar = await Level.findOne({ levelID }).exec();
    if (!findVar) errorFields.push("Invalid Level");
    if (findVar?.status === false) errorFields.push("Level is disabled!");

    // * Check Section
    findVar = await Section.findOne({ sectionID }).exec();

    if (!findVar) {
      errorFields.push("Invalid Section!");
    } else {
      if (findVar?.levelID !== levelID)
        errorFields.push("Level and Section does not match!");
    }
    if (findVar?.status === false) errorFields.push("Section is disabled!");
    if (errorFields.length > 0)
      return res.status(400).json({ message: "Invalid Fields!", errorFields });
    const enrollmentID =
      schoolYearID +
      "_" +
      LRN +
      "-" +
      levelID +
      sectionID +
      (strandID ? "-" + strandID : "") +
      "_" +
      term;
    const findDuplicate = await Enrolled.findOne({
      enrollmentID,
    });
    if (findDuplicate)
      return res.status(400).json({
        message: `Student [${LRN}] already enrolled on year ${schoolYearID}, Level ${levelID} - Section ${sectionID}!`,
      });
    const findMoreDuplicate = await Enrolled.findOne({
      LRN,
    }).exec();

    if (findMoreDuplicate?.schoolYearID === schoolYearID)
      return res.status(400).json({
        message: `Student [${findMoreDuplicate.LRN}] already enrolled on year ${findMoreDuplicate.schoolYearID}, Level ${findMoreDuplicate.levelID} - Section ${findMoreDuplicate.sectionID}!`,
      });

    res.status(200).json({ LRN });
  },
  getAllDoc: async (req, res) => {
    try {
      const response = await Enrolled.aggregate([
        {
          $lookup: {
            from: "students",
            localField: "LRN",
            foreignField: "LRN",
            as: "details",
          },
        },
        {
          $unwind: {
            path: "$details",
          },
        },
      ]);
      if (!response || response.length <= 0)
        return res.status(204).json({ message: "No records found!" });
      res.json(response);
    } catch (error) {
      console.log(
        "🚀 ~ file: enrolledController.js:62 ~ getAllDoc: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  getDocByID: async (req, res) => {
    try {
      const enrollmentID = req?.params?.enrollmentID;
      if (!enrollmentID) {
        return res.status(400).json({ message: "Enrollment ID is required!" });
      }
      const findDoc = await Enrolled.aggregate([
        {
          $match: {
            enrollmentID: enrollmentID,
          },
        },
        {
          $lookup: {
            from: "students",
            localField: "LRN",
            foreignField: "LRN",
            as: "result",
          },
        },
        {
          $unwind: {
            path: "$result",
          },
        },

        {
          $set: {
            firstName: {
              $toString: "$result.firstName",
            },
            middleName: {
              $toString: "$result.middleName",
            },
            lastName: {
              $toString: "$result.lastName",
            },
            gender: {
              $toString: "$result.gender",
            },
            dateOfBirth: {
              $toString: "$result.dateOfBirth",
            },
          },
        },
      ]).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Enrollment ID ${enrollmentID} not found!` });
      }
      res.status(200).json(findDoc[0]);
    } catch (error) {
      console.log(
        "🚀 ~ file: enrolledController.js:124 ~ updateDocByID: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  updateDocByID: async (req, res) => {
    try {
      let emptyFields = [];
      if (!req?.params?.enrollmentID)
        return res.status(400).json({ message: "Enrollment ID is required!" });
      const enrollmentID = req?.params?.enrollmentID;

      const findDoc = await Enrolled.findOne({ enrollmentID }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Enrollment ID ${enrollmentID} not found!` });
      }
      const { levelID, strandID, term, sectionID, depID } = req.body;
      if (!levelID) emptyFields.push("Level ID");
      if (!sectionID) emptyFields.push("Section ID");
      if (!depID) emptyFields.push("Department ID");
      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });
      const docObject = { levelID, strandID, term, sectionID, depID };
      const update = await Enrolled.findOneAndUpdate({ strandID }, docObject);
      if (!update)
        return res.status(400).json({ message: "Strand update failed!" });
      res.status(200).json(update);
    } catch (error) {
      console.log(
        "🚀 ~ file: enrolledController.js:212 ~ updateDocByID: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  deleteDocByID: async (req, res) => {
    try {
      if (!req.params.enrollmentID)
        return res.status(400).json({ message: "Enrollment ID is required!" });
      const enrollmentID = req.params.enrollmentID;
      const findDoc = await Enrolled.findOne({ enrollmentID }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Enrollment ID ${enrollmentID} not found!` });
      }
      const deleteItem = await findDoc.deleteOne({ enrollmentID });
      res.status(200).json(deleteItem);
    } catch (error) {
      console.log(
        "🚀 ~ file: enrolledController.js:141 ~ deleteDocByID: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  toggleDocStatus: async (req, res) => {
    try {
      if (!req.params.enrollmentID)
        return res.status(400).json({ message: "Enrollment ID is required!" });
      const enrollmentID = req.params.enrollmentID;
      const { status } = req.body;
      const findDoc = await Enrolled.findOne({ enrollmentID }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Enrollment ID ${enrollmentID} not found!` });
      }

      const updateStatus = await Section.findOneAndUpdate(
        { enrollmentID },
        {
          status,
        }
      );
      if (!updateStatus) {
        return res
          .status(400)
          .json({ message: "Enrolled status update failed!" });
      }
      console.log(updateStatus);
      res.status(200).json(updateStatus);
    } catch (error) {
      console.log(
        "🚀 ~ file: enrolledController.js:175 ~ toggleDocStatus: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = enrolledController;

const Department = require("../model/Department");
const Level = require("../model/Level");
const Section = require("../model/Section");
const Strand = require("../model/Strand");
const Subject = require("../model/Subject");
const Schedule = require("../model/Schedule");
const Enrolled = require("../model/Enrolled");
const departmentController = {
  createDoc: async (req, res) => {
    let emptyFields = [];
    try {
      const { depID, depName } = req.body;
      if (!depID) emptyFields.push("Department ID");
      if (!depName) emptyFields.push("Department Name");
      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });

      const duplicate = await Department.findOne({
        depID,
      })
        .lean()
        .exec();
      if (duplicate)
        return res.status(409).json({ message: "Duplicate Department!" });

      // Create Object
      const docObject = { depID, depName };
      // Create and Store new Doc
      const response = await Department.create(docObject);
      if (response) {
        if (depID === "elem") {
          let bulkLevel = [];
          let bulkSub = [];
          for (let x = 1; x <= 6; x++) {
            bulkLevel.push({
              updateOne: {
                filter: {
                  levelID: depID + x,
                },
                update: {
                  $set: {
                    levelID: depID + x,
                    levelNum: x,
                    depID: depID,
                  },
                },
                upsert: true,
              },
            });
          }
          const bulkUp = await Level.bulkWrite(bulkLevel);

          for (let x = 1; x <= 6; x++) {
            bulkSub.push({
              updateOne: {
                filter: {
                  subjectID: "fil" + x,
                },
                update: {
                  $set: {
                    subjectID: "fil" + x,
                    levelID: "elem" + x,
                    strandID: "",
                    subjectName: "filipino " + x,
                  },
                },
                upsert: true,
              },
            });
          }
          for (let x = 1; x <= 6; x++) {
            bulkSub.push({
              updateOne: {
                filter: {
                  subjectID: "eng" + x,
                },
                update: {
                  $set: {
                    subjectID: "eng" + x,
                    levelID: "elem" + x,
                    strandID: "",
                    subjectName: "english " + x,
                  },
                },
                upsert: true,
              },
            });
          }
          for (let x = 1; x <= 6; x++) {
            bulkSub.push({
              updateOne: {
                filter: {
                  subjectID: "scie" + x,
                },
                update: {
                  $set: {
                    subjectID: "scie" + x,
                    levelID: "elem" + x,
                    strandID: "",
                    subjectName: "science " + x,
                  },
                },
                upsert: true,
              },
            });
          }
          for (let x = 1; x <= 6; x++) {
            bulkSub.push({
              updateOne: {
                filter: {
                  subjectID: "math" + x,
                },
                update: {
                  $set: {
                    subjectID: "math" + x,
                    levelID: "elem" + x,
                    strandID: "",
                    subjectName: "mathematics " + x,
                  },
                },
                upsert: true,
              },
            });
          }
          for (let x = 1; x <= 6; x++) {
            bulkSub.push({
              updateOne: {
                filter: {
                  subjectID: "ap" + x,
                },
                update: {
                  $set: {
                    subjectID: "ap" + x,
                    levelID: "elem" + x,
                    strandID: "",
                    subjectName: "araling panlipunan " + x,
                  },
                },
                upsert: true,
              },
            });
          }

          for (let x = 1; x <= 6; x++) {
            bulkSub.push({
              updateOne: {
                filter: {
                  subjectID: "esp" + x,
                },
                update: {
                  $set: {
                    subjectID: "esp" + x,
                    levelID: "elem" + x,
                    strandID: "",
                    subjectName: "edukasyon sa pagpapakatao " + x,
                  },
                },
                upsert: true,
              },
            });
          }
          for (let x = 1; x <= 6; x++) {
            bulkSub.push({
              updateOne: {
                filter: {
                  subjectID: "mapeh" + x,
                },
                update: {
                  $set: {
                    subjectID: "mapeh" + x,
                    levelID: "elem" + x,
                    strandID: "",
                    subjectName: "music, arts, physical education, health " + x,
                  },
                },
                upsert: true,
              },
            });
          }
          for (let x = 1; x <= 6; x++) {
            bulkSub.push({
              updateOne: {
                filter: {
                  subjectID: "epp" + x,
                },
                update: {
                  $set: {
                    subjectID: "epp" + x,
                    levelID: "elem" + x,
                    strandID: "",
                    subjectName: "edukasyong pantahanan at pangkabuhayan " + x,
                  },
                },
                upsert: true,
              },
            });
          }
          for (let x = 1; x <= 6; x++) {
            bulkSub.push({
              updateOne: {
                filter: {
                  subjectID: "tle" + x,
                },
                update: {
                  $set: {
                    subjectID: "tle" + x,
                    levelID: "elem" + x,
                    strandID: "",
                    subjectName: "technology and livelihood Education " + x,
                  },
                },
                upsert: true,
              },
            });
          }
          const bulkUpSub = await Subject.bulkWrite(bulkSub);
          console.log(
            "🚀 ~ file: departmentController.js:372 ~ createDoc: ~ bulkUpSub:",
            bulkUpSub
          );
          console.log(
            "🚀 ~ file: departmentController.js:66 ~ createDoc: ~ bulkUp:",
            bulkUp
          );
        }
        if (depID === "jhs") {
          let bulkLevel = [];
          let bulkSub = [];
          for (let x = 7; x <= 10; x++) {
            bulkLevel.push({
              updateOne: {
                filter: {
                  levelID: depID + x,
                },
                update: {
                  $set: {
                    levelID: depID + x,
                    levelNum: x,
                    depID: depID,
                  },
                },
                upsert: true,
              },
            });
          }
          const bulkUp = await Level.bulkWrite(bulkLevel);

          for (let x = 7; x <= 10; x++) {
            bulkSub.push({
              updateOne: {
                filter: {
                  subjectID: "fil" + x,
                },
                update: {
                  $set: {
                    subjectID: "fil" + x,
                    levelID: "elem" + x,
                    strandID: "",
                    subjectName: "filipino " + x,
                  },
                },
                upsert: true,
              },
            });
          }
          for (let x = 7; x <= 10; x++) {
            bulkSub.push({
              updateOne: {
                filter: {
                  subjectID: "eng" + x,
                },
                update: {
                  $set: {
                    subjectID: "eng" + x,
                    levelID: "elem" + x,
                    strandID: "",
                    subjectName: "english " + x,
                  },
                },
                upsert: true,
              },
            });
          }
          for (let x = 7; x <= 10; x++) {
            bulkSub.push({
              updateOne: {
                filter: {
                  subjectID: "scie" + x,
                },
                update: {
                  $set: {
                    subjectID: "scie" + x,
                    levelID: "elem" + x,
                    strandID: "",
                    subjectName: "science " + x,
                  },
                },
                upsert: true,
              },
            });
          }
          for (let x = 7; x <= 10; x++) {
            bulkSub.push({
              updateOne: {
                filter: {
                  subjectID: "math" + x,
                },
                update: {
                  $set: {
                    subjectID: "math" + x,
                    levelID: "elem" + x,
                    strandID: "",
                    subjectName: "mathematics " + x,
                  },
                },
                upsert: true,
              },
            });
          }
          for (let x = 7; x <= 10; x++) {
            bulkSub.push({
              updateOne: {
                filter: {
                  subjectID: "ap" + x,
                },
                update: {
                  $set: {
                    subjectID: "ap" + x,
                    levelID: "elem" + x,
                    strandID: "",
                    subjectName: "araling panlipunan " + x,
                  },
                },
                upsert: true,
              },
            });
          }

          for (let x = 7; x <= 10; x++) {
            bulkSub.push({
              updateOne: {
                filter: {
                  subjectID: "esp" + x,
                },
                update: {
                  $set: {
                    subjectID: "esp" + x,
                    levelID: "elem" + x,
                    strandID: "",
                    subjectName: "edukasyon sa pagpapakatao " + x,
                  },
                },
                upsert: true,
              },
            });
          }
          for (let x = 7; x <= 10; x++) {
            bulkSub.push({
              updateOne: {
                filter: {
                  subjectID: "mapeh" + x,
                },
                update: {
                  $set: {
                    subjectID: "mapeh" + x,
                    levelID: "elem" + x,
                    strandID: "",
                    subjectName: "music, arts, physical education, health " + x,
                  },
                },
                upsert: true,
              },
            });
          }
          for (let x = 7; x <= 10; x++) {
            bulkSub.push({
              updateOne: {
                filter: {
                  subjectID: "epp" + x,
                },
                update: {
                  $set: {
                    subjectID: "epp" + x,
                    levelID: "elem" + x,
                    strandID: "",
                    subjectName: "edukasyong pantahanan at pangkabuhayan " + x,
                  },
                },
                upsert: true,
              },
            });
          }
          for (let x = 7; x <= 10; x++) {
            bulkSub.push({
              updateOne: {
                filter: {
                  subjectID: "tle" + x,
                },
                update: {
                  $set: {
                    subjectID: "tle" + x,
                    levelID: "elem" + x,
                    strandID: "",
                    subjectName: "technology and livelihood Education " + x,
                  },
                },
                upsert: true,
              },
            });
          }
          const bulkUpSub = await Subject.bulkWrite(bulkSub);
          console.log(
            "🚀 ~ file: departmentController.js:372 ~ createDoc: ~ bulkUpSub:",
            bulkUpSub
          );
          console.log(
            "🚀 ~ file: departmentController.js:66 ~ createDoc: ~ bulkUp:",
            bulkUp
          );
        }
        if (depID === "shs") {
          let bulkLevel = [];
          let bulkSub = [];
          for (let x = 11; x <= 12; x++) {
            bulkLevel.push({
              updateOne: {
                filter: {
                  levelID: depID + x,
                },
                update: {
                  $set: {
                    levelID: depID + x,
                    levelNum: x,
                    depID: depID,
                  },
                },
                upsert: true,
              },
            });
          }
          const bulkUp = await Level.bulkWrite(bulkLevel);

          console.log(
            "🚀 ~ file: departmentController.js:66 ~ createDoc: ~ bulkUp:",
            bulkUp
          );
        }
      }
      res.status(201).json(response);
    } catch (error) {
      console.log(
        "🚀 ~ file: departmentController.js:29 ~ createDoc: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  getAllDoc: async (req, res) => {
    try {
      const doc = await Department.find().sort({ createdAt: -1 }).lean();
      if (!doc) return res.status(204).json({ message: "No Records Found!" });
      res.status(200).json(doc);
    } catch (error) {
      console.log(
        "🚀 ~ file: departmentController.js:42 ~ getAllDoc: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  getDocByID: async (req, res) => {
    try {
      if (!req.params.depID)
        return res.status(400).json({ message: "Department ID is required!" });

      const depID = req.params.depID;
      const findDoc = await Department.findOne({ depID }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Department ID ${depID} not found!` });
      }
      res.json(findDoc);
    } catch (error) {
      console.log(
        "🚀 ~ file: departmentController.js:62 ~ getDocByID: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  updateDocByID: async (req, res) => {
    try {
      if (!req.params.depID)
        return res.status(400).json({ message: "Department ID is required!" });
      const depID = req.params.depID;
      const findDoc = await Department.findOne({ depID }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Department ID ${depID} not found!` });
      }
      const updateDoc = await Department.findOneAndUpdate(
        { depID },
        {
          ...req.body,
        }
      );

      if (!updateDoc) {
        return res.status(400).json({ error: "Department update failed!" });
      }
      res.json(updateDoc);
    } catch (error) {
      console.log(
        "🚀 ~ file: departmentController.js:92 ~ updateDocByID: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  deleteDocByID: async (req, res) => {
    try {
      if (!req.params.depID)
        return res.status(400).json({ message: "Department ID is required!" });
      const depID = req.params.depID;
      const findDoc = await Department.findOne({ depID }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Department ID ${depID} not found!` });
      }
      // ? Find matched Levels
      const findLevel = await Level.findOne({ depID }).exec();
      if (findLevel)
        return res.status(400).json({
          message: `Cannot delete Department ${depID}, Department has an existing record/s in Levels Collection.`,
        });
      // ? Find matched Sections
      const findSections = await Section.findOne({ depID }).exec();
      if (findSections)
        return res.status(400).json({
          message: `Cannot delete Department ${depID}, Department has an existing record/s in Sections Collection.`,
        });
      // ? Find matched Strands
      const findStrands = await Strand.findOne({ depID }).exec();
      if (findStrands)
        return res.status(400).json({
          message: `Cannot delete Department ${depID}, Department has an existing record/s in Strands Collection.`,
        });

      // ? Find matched Subjects
      const findSubjects = await Subject.findOne({ depID }).exec();
      if (findSubjects)
        return res.status(400).json({
          message: `Cannot delete Department ${depID}, Department has an existing record/s in Subjects Collection.`,
        });

      // ? Find matched Schedules
      const findSchedules = await Schedule.findOne({ depID }).exec();
      if (findSchedules)
        return res.status(400).json({
          message: `Cannot delete Department ${depID}, Department has an existing record/s in Schedules Collection.`,
        });

      // ? Find matched Enrollments
      const findEnrollments = await Enrolled.findOne({ depID }).exec();
      if (findEnrollments)
        return res.status(400).json({
          message: `Cannot delete Department ${depID}, Department has an existing record/s in Enrollments Collection.`,
        });

      const deleteItem = await findDoc.deleteOne({ depID });
      res.status(200).json(deleteItem);
    } catch (error) {
      console.log(
        "🚀 ~ file: departmentController.js:113 ~ deleteDocByID: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  toggleDocStatus: async (req, res) => {
    try {
      if (!req.params.depID)
        return res.status(400).json({ message: "Department ID is required!" });
      const depID = req.params.depID;
      const { status } = req.body;
      if (status !== true && status !== false)
        return res.status(400).json({ message: "Invalid Status" });

      const findDoc = await Department.findOne({ depID }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Department ID ${depID} not found!` });
      }
      const updateStatus = await Department.findOneAndUpdate(
        { depID },
        {
          status,
        }
      );
      if (!updateStatus) {
        return res
          .status(400)
          .json({ message: "Department status update failed!" });
      }
      console.log(updateStatus);
      res.status(200).json(updateStatus);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
module.exports = departmentController;

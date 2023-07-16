const Strand = require("../model/Strand");
const Section = require("../model/Section");
const Subject = require("../model/Subject");
const Schedule = require("../model/Schedule");
const Enrolled = require("../model/Enrolled");
const strandController = {
  createDoc: async (req, res) => {
    let emptyFields = [];
    try {
      const { strandID, depID, levelID, strandName } = req.body;
      if (!strandID) emptyFields.push("Strand ID");
      if (!depID) emptyFields.push("Department ID");
      if (!levelID) emptyFields.push("Level ID");
      if (!strandName) emptyFields.push("Strand Name");

      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });

      const duplicate = await Strand.findOne({
        strandID,
      })
        .lean()
        .exec();
      if (duplicate)
        return res.status(409).json({ message: "Duplicate Strand ID!" });

      const docObject = {
        strandID,
        depID,
        levelID,
        strandName,
      };
      const createDoc = await Strand.create(docObject);
      res.status(201).json(createDoc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getAllDoc: async (req, res) => {
    try {
      const strand = await Strand.aggregate([
        {
          $lookup: {
            from: "levels",
            localField: "levelID",
            foreignField: "levelID",
            as: "level",
          },
        },
        {
          $unwind: {
            path: "$level",
          },
        },
        {
          $set: {
            levelNum: { $toString: "$level.levelNum" },
          },
        },
      ]);
      if (!strand) return res.status(204).json({ message: "No record found!" });
      res.status(200).json(strand);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getDocByID: async (req, res) => {
    try {
      if (!req?.params?.strandID) {
        return res.status(400).json({ message: "ID is required!" });
      }
      const strandID = req?.params?.strandID;
      const findDoc = await Strand.findOne({ strandID }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Strand ID ${strandID} not found!` });
      }
      res.json(findDoc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateDocByID: async (req, res) => {
    try {
      if (!req?.params?.strandID) {
        return res.status(400).json({ message: "ID is required!" });
      }
      const strandID = req?.params?.strandID;
      const findDoc = await Strand.findOne({ strandID }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Strand ID ${strandID} not found!` });
      }
      const { depID, levelID, strandName } = req.body;
      const docObject = { depID, levelID, strandName };
      const update = await Strand.findOneAndUpdate({ strandID }, docObject);
      if (!update)
        return res.status(400).json({ message: "Strand update failed!" });
      res.status(200).json(update);
    } catch (error) {
      console.log(
        "🚀 ~ file: subjectController.js:97 ~ updateDocByID: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  deleteDocByID: async (req, res) => {
    try {
      if (!req?.params?.strandID) {
        return res.status(400).json({ message: "ID is required!" });
      }
      const strandID = req?.params?.strandID;
      const findDoc = await Strand.findOne({ strandID }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Strand ID ${strandID} not found!` });
      }
      // ? Find matched Sections
      const findSections = await Section.findOne({ strandID }).exec();
      if (findSections)
        return res.status(400).json({
          message: `Cannot delete Strand ${strandID}, Strand has an existing record/s in Sections Collection.`,
        });

      // ? Find matched Subjects
      const findSubjects = await Subject.findOne({ strandID }).exec();
      if (findSubjects)
        return res.status(400).json({
          message: `Cannot delete Strand ${strandID}, Strand has an existing record/s in Subjects Collection.`,
        });

      // ? Find matched Schedules
      const findSchedules = await Schedule.findOne({ strandID }).exec();
      if (findSchedules)
        return res.status(400).json({
          message: `Cannot delete Strand ${strandID}, Strand has an existing record/s in Schedules Collection.`,
        });

      // ? Find matched Enrollments
      const findEnrollments = await Enrolled.findOne({ strandID }).exec();
      if (findEnrollments)
        return res.status(400).json({
          message: `Cannot delete Strand ${strandID}, Strand has an existing record/s in Enrollments Collection.`,
        });
      const deleteItem = await findDoc.deleteOne({ strandID });
      res.status(200).json(deleteItem);
    } catch (error) {
      console.log(
        "🚀 ~ file: subjectController.js:119 ~ deleteDocByID: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  toggleDocStatus: async (req, res) => {
    try {
      if (!req?.params?.strandID) {
        return res.status(400).json({ message: "Strand ID is required!" });
      }
      const strandID = req?.params?.strandID;
      const { status } = req.body;
      const findDoc = await Strand.findOne({ strandID }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Strand ID ${strandID} not found!` });
      }
      const updateStatus = await Strand.findOneAndUpdate(
        { strandID },
        {
          status,
        }
      );
      if (!updateStatus) {
        return res
          .status(400)
          .json({ message: "Strand status update failed!" });
      }
      console.log(updateStatus);
      res.status(200).json(updateStatus);
    } catch (error) {
      console.log(
        "🚀 ~ file: strandController.js:157 ~ toggleDocStatus: ~ error",
        error
      );

      res.status(500).json({ message: error.message });
    }
  },
};
module.exports = strandController;

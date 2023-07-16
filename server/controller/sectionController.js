const Section = require("../model/Section");
const Strand = require("../model/Strand");
const Subject = require("../model/Subject");
const Schedule = require("../model/Schedule");
const Enrolled = require("../model/Enrolled");

const sectionController = {
  createDoc: async (req, res) => {
    let emptyFields = [];
    try {
      const { sectionID, depID, levelID, sectionName, strandID } = req.body;
      if (!sectionID) emptyFields.push("Section ID");
      if (!depID) emptyFields.push("Department ID");
      if (!levelID) emptyFields.push("Level ID");
      if (!sectionName) emptyFields.push("Section Name");

      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });

      const duplicate = await Section.findOne({
        sectionID,
      })
        .lean()
        .exec();
      if (duplicate)
        return res.status(409).json({ message: "Duplicate Section!" });

      const docObject = { sectionID, depID, levelID, sectionName, strandID };
      const createDoc = await Section.create(docObject);
      res.status(201).json(createDoc);
    } catch (error) {
      console.log(
        "🚀 ~ file: sectionController.js:30 ~ createDoc: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  getAllDoc: async (req, res) => {
    try {
      const doc = await Section.aggregate([
        {
          $lookup: {
            from: "levels",
            localField: "levelID",
            foreignField: "levelID",
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
            levelNum: {
              $toString: "$result.levelNum",
            },
            depID: {
              $toString: "$result.depID",
            },
            lvlStatus: {
              $toBool: "$result.status",
            },
          },
        },
      ]);
      if (!doc) return res.status(404).json({ message: "No Data Found!" });
      res.status(200).json(doc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getDocByID: async (req, res) => {
    try {
      if (!req.params.sectionID)
        return res.status(400).json({ message: "Section ID is required!" });
      const sectionID = req.params.sectionID;
      const findDoc = await Section.findOne({ sectionID }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Section ID ${sectionID} not found!` });
      }
      res.json(findDoc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateDocByID: async (req, res) => {
    try {
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteDocByID: async (req, res) => {
    try {
      if (!req.params.sectionID)
        return res.status(400).json({ message: "Section ID is required!" });
      const sectionID = req.params.sectionID;
      const findDoc = await Section.findOne({ sectionID }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Section ID ${sectionID} not found!` });
      }

      // ? Find matched Schedules
      const findSchedules = await Schedule.findOne({ sectionID }).exec();
      if (findSchedules)
        return res.status(400).json({
          message: `Cannot delete Section ${sectionID}, Section has an existing record/s in Schedules Collection.`,
        });

      // ? Find matched Enrollments
      const findEnrollments = await Enrolled.findOne({ sectionID }).exec();
      if (findEnrollments)
        return res.status(400).json({
          message: `Cannot delete Section ${sectionID}, Section has an existing record/s in Enrollments Collection.`,
        });

      const deleteItem = await findDoc.deleteOne({ sectionID });
      res.status(200).json(deleteItem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  toggleDocStatus: async (req, res) => {
    try {
      if (!req.params.sectionID)
        return res.status(400).json({ message: "Section ID is required!" });
      const sectionID = req.params.sectionID;
      const { status } = req.body;
      const findDoc = await Section.findOne({ sectionID }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Section ID ${sectionID} not found!` });
      }

      const updateStatus = await Section.findOneAndUpdate(
        { sectionID },
        {
          status,
        }
      );
      if (!updateStatus) {
        return res
          .status(400)
          .json({ message: "Section status update failed!" });
      }
      console.log(updateStatus);
      res.status(200).json(updateStatus);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = sectionController;

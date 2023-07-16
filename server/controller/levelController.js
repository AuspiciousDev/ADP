const Level = require("../model/Level");
const Section = require("../model/Section");
const Strand = require("../model/Strand");
const Subject = require("../model/Subject");
const Schedule = require("../model/Schedule");
const Enrolled = require("../model/Enrolled");
const levelController = {
  createDoc: async (req, res) => {
    let emptyFields = [];
    try {
      const { levelID, levelNum, depID } = req.body;
      if (!levelID) emptyFields.push("Level ID");
      if (!levelNum) emptyFields.push("Level Num");
      if (!depID) emptyFields.push("Level ID");
      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });
      const duplicate = await Level.findOne({
        levelID,
      })
        .lean()
        .exec();
      if (duplicate)
        return res.status(409).json({ message: "Duplicate Level!" });

      // Create Object
      const docObject = { levelID, levelNum, depID };
      // Create and Store new Doc
      const response = await Level.create(docObject);
      res.status(201).json(response);
    } catch (error) {
      console.log(
        "🚀 ~ file: levelController.js:29 ~ createDoc: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  getAllDoc: async (req, res) => {
    try {
      // const doc = await Level.find();
      const doc = await Level.aggregate([
        {
          $lookup: {
            from: "departments",
            localField: "depID",
            foreignField: "depID",
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
            depName: {
              $toString: "$result.depName",
            },
            depStatus: {
              $toBool: "$result.status",
            },
          },
        },
        {
          $sort: {
            levelNum: 1,
          },
        },
      ]);
      if (!doc) return res.status(204).json({ message: "No Records Found!" });
      res.status(200).json(doc);
    } catch (error) {
      console.log(
        "🚀 ~ file: levelController.js:42 ~ getAllDoc: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  getDocByID: async (req, res) => {
    try {
      if (!req.params.levelID)
        return res.status(400).json({ message: "Level ID is required!" });
      const levelID = req.params.levelID;
      const findDoc = await Level.findOne({ levelID }).exec();
      if (!findDoc)
        return res
          .status(400)
          .json({ message: `Level ID [${levelID}] not found!` });
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
      if (!req.params.levelID)
        return res.status(400).json({ message: "Level ID is required!" });
      const levelID = req.params.levelID;
      const findDoc = await Level.findOne({ levelID }).exec();
      if (!findDoc)
        return res
          .status(400)
          .json({ message: `Level ID [${levelID}] not found!` });

      // ? Find matched Sections
      const findSections = await Section.findOne({ levelID }).exec();
      if (findSections)
        return res.status(400).json({
          message: `Cannot delete Level ${levelID}, Level has an existing record/s in Sections Collection.`,
        });
      // ? Find matched Strands
      const findStrands = await Strand.findOne({ levelID }).exec();
      if (findStrands)
        return res.status(400).json({
          message: `Cannot delete Level ${levelID}, Level has an existing record/s in Strands Collection.`,
        });

      // ? Find matched Subjects
      const findSubjects = await Subject.findOne({ levelID }).exec();
      if (findSubjects)
        return res.status(400).json({
          message: `Cannot delete Level ${levelID}, Level has an existing record/s in Subjects Collection.`,
        });

      // ? Find matched Schedules
      const findSchedules = await Schedule.findOne({ levelID }).exec();
      if (findSchedules)
        return res.status(400).json({
          message: `Cannot delete Level ${levelID}, Level has an existing record/s in Schedules Collection.`,
        });

      // ? Find matched Enrollments
      const findEnrollments = await Enrolled.findOne({ levelID }).exec();
      if (findEnrollments)
        return res.status(400).json({
          message: `Cannot delete Level ${levelID}, Level has an existing record/s in Enrollments Collection.`,
        });
      const deleteDoc = await findDoc.deleteOne({ levelID });
      res.json(deleteDoc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  toggleDocStatus: async (req, res) => {
    try {
      if (!req.params.levelID)
        return res.status(400).json({ message: "Level ID is required!" });
      const levelID = req.params.levelID;
      const { status } = req.body;

      if (status !== true && status !== false)
        return res.status(400).json({ message: "Invalid Status" });

      const findDoc = await Level.findOne({ levelID }).exec();
      if (!findDoc)
        return res
          .status(400)
          .json({ message: `Level ID [${levelID}] not found!` });

      const updateStatus = await Level.findOneAndUpdate(
        { levelID },
        {
          status,
        }
      );
      if (!updateStatus) {
        return res.status(400).json({ message: "Level status update failed!" });
      }
      console.log(updateStatus);
      res.status(200).json(updateStatus);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = levelController;

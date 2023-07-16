const Subject = require("../model/Subject");
const Schedule = require("../model/Schedule");
const subjectController = {
  createDoc: async (req, res) => {
    let emptyFields = [];
    try {
      const { subjectID, levelID, subjectName, description, strandID } =
        req.body;
      if (!subjectID) emptyFields.push("Subject ID");
      if (!levelID) emptyFields.push("Level ID");
      if (!subjectName) emptyFields.push("Subject Name");

      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });

      const duplicate = await Subject.findOne({
        subjectID,
      })
        .lean()
        .exec();
      if (duplicate)
        return res.status(409).json({ message: "Duplicate Subject ID!" });

      const docObject = {
        subjectID,
        levelID,
        subjectName,
        strandID,
        description,
      };
      const createDoc = await Subject.create(docObject);
      res.status(201).json(createDoc);
    } catch (error) {
      console.log(
        "🚀 ~ file: subjectController.js:36 ~ createDoc: ~ error:",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  getAllDoc: async (req, res) => {
    try {
      const subject = await Subject.aggregate([
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
      if (!subject)
        return res.status(204).json({ message: "No record found!" });
      res.status(200).json(subject);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getDocByID: async (req, res) => {
    try {
      if (!req?.params?.subjectID) {
        return res.status(400).json({ message: "ID is required!" });
      }
      const subjectID = req?.params?.subjectID;
      const findDoc = await Subject.findOne({ subjectID }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Subject ID ${subjectID} not found!` });
      }
      res.json(findDoc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateDocByID: async (req, res) => {
    try {
      if (!req?.params?.subjectID) {
        return res.status(400).json({ message: "ID is required!" });
      }
      const subjectID = req?.params?.subjectID;
      const findDoc = await Subject.findOne({ subjectID }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Subject ID ${subjectID} not found!` });
      }
      const { levelID, strandID, subjectName, description } = req.body;
      const docObject = { strandID, levelID, subjectName, description };
      const update = await Subject.findOneAndUpdate({ subjectID }, docObject);
      if (!update)
        return res.status(400).json({ message: "Subject update failed!" });
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
      if (!req?.params?.subjectID) {
        return res.status(400).json({ message: "ID is required!" });
      }
      const subjectID = req?.params?.subjectID;
      const findDoc = await Subject.findOne({ subjectID }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Subject ID ${subjectID} not found!` });
      }
      // ? Find matched Schedules
      const findSchedules = await Schedule.findOne({
        schedule: {
          $elemMatch: { subjectID },
        },
      }).exec();
      if (findSchedules)
        return res.status(400).json({
          message: `Cannot delete Subject ${subjectID}, Subject has an existing record/s in Schedules Collection.`,
        });

      const deleteItem = await findDoc.deleteOne({ subjectID });
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
      if (!req?.params?.subjectID) {
        return res.status(400).json({ message: "Subject ID is required!" });
      }
      const subjectID = req?.params?.subjectID;
      const { status } = req.body;
      const findDoc = await Subject.findOne({ subjectID }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Subject ID ${subjectID} not found!` });
      }
      const updateStatus = await Subject.findOneAndUpdate(
        { subjectID },
        {
          status,
        }
      );
      if (!updateStatus) {
        return res
          .status(400)
          .json({ message: "Subject status update failed!" });
      }
      console.log(updateStatus);
      res.status(200).json(updateStatus);
    } catch (error) {
      console.log(
        "🚀 ~ file: subjectController.js:153 ~ toggleDocStatus: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = subjectController;

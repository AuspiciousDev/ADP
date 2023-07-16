const Schedule = require("../model/Schedule");
const Subject = require("../model/Subject");

const scheduleController = {
  createDoc: async (req, res) => {
    let emptyFields = [];
    try {
      const {
        schoolYearID,
        depID,
        levelID,
        term,
        strandID,
        sectionID,
        adviserID,
        adviserName,
        schedule,
      } = req.body;
      if (!schoolYearID) emptyFields.push("School Year ID");
      if (!depID) emptyFields.push("Department ID");
      if (!levelID) emptyFields.push("Level ID");
      if (!term) emptyFields.push("Term");
      if (!sectionID) emptyFields.push("Section ID");

      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });
      // ! Schedule ID

      const scheduleID =
        schoolYearID +
        "_" +
        levelID +
        sectionID +
        (strandID ? "-" + strandID : "") +
        "_" +
        term;
      const duplicate = await Schedule.findOne({
        scheduleID,
      })
        .lean()
        .exec();
      if (duplicate)
        return res.status(409).json({ message: "Duplicate Schedule ID!" });

      const docObject = {
        scheduleID,
        schoolYearID,
        depID,
        levelID,
        term,
        strandID,
        sectionID,
        adviserID,
        adviserName,
        schedule,
      };
      const createDoc = await Schedule.create(docObject);
      res.status(201).json(createDoc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getAllDoc: async (req, res) => {
    try {
      const doc = await Schedule.find().sort({ createdAt: -1 }).lean();
      if (!doc) return res.status(204).json({ message: "No Records Found!" });
      res.status(200).json(doc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getDocByID: async (req, res) => {
    try {
      if (!req?.params?.scheduleID) {
        return res.status(400).json({ message: "Schedule ID is required!" });
      }
      const scheduleID = req?.params?.scheduleID;
      const findDoc = await Schedule.findOne({ scheduleID }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Schedule ID ${scheduleID} not found!` });
      }
      res.json(findDoc);
    } catch (error) {
      console.log(
        "🚀 ~ file: scheduleController.js:82 ~ getDocByID: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  updateDocByID: async (req, res) => {
    try {
      if (!req?.params?.scheduleID) {
        return res.status(400).json({ message: "Schedule ID is required!" });
      }
      const scheduleID = req?.params?.scheduleID;
      const findDoc = await Schedule.findOne({ scheduleID }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Schedule ID ${scheduleID} not found!` });
      }
      const { schedule, adviserID, adviserName } = req.body;
      if (!Array.isArray(schedule) || schedule.length === 0)
        return res.status(400).json({ message: `Schedules is empty` });
      const update = await Schedule.findOneAndUpdate(
        { scheduleID },
        {
          $set: {
            schedule: schedule,
            adviserID,
            adviserName,
          },
        }
      );
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
      if (!req?.params?.scheduleID) {
        return res.status(400).json({ message: "Schedule ID is required!" });
      }
      const scheduleID = req?.params?.scheduleID;
      const findDoc = await Schedule.findOne({ scheduleID }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Schedule ID ${scheduleID} not found!` });
      }
      const deleteItem = await findDoc.deleteOne({ scheduleID });
      res.status(200).json(deleteItem);
    } catch (error) {
      console.log(
        "🚀 ~ file: scheduleController.js:125 ~ deleteDocByID: ~ error",
        error
      );

      res.status(500).json({ message: error.message });
    }
  },
  toggleDocStatus: async (req, res) => {
    try {
      if (!req?.params?.scheduleID) {
        return res.status(400).json({ message: "Schedule ID is required!" });
      }
      const scheduleID = req?.params?.scheduleID;
      const { status } = req.body;
      const findDoc = await Schedule.findOne({ scheduleID }).exec();
      if (!findDoc) {
        return res
          .status(400)
          .json({ message: `Schedule ID ${scheduleID} not found!` });
      }
      const updateStatus = await Schedule.findOneAndUpdate(
        { scheduleID },
        {
          status,
        }
      );
      if (!updateStatus) {
        return res
          .status(400)
          .json({ message: "Schedule status update failed!" });
      }
      console.log(updateStatus);
      res.status(200).json(updateStatus);
    } catch (error) {
      console.log(
        "🚀 ~ file: scheduleController.js:160 ~ toggleDocStatus: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = scheduleController;

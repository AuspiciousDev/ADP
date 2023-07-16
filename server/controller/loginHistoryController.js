const LoginHistory = require("../model/LoginHistory");

const loginHistoryController = {
  createDoc: async (req, res) => {
    try {
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getAllDoc: async (req, res) => {
    try {
      const doc = await LoginHistory.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "username",
            foreignField: "username",
            as: "profile",
          },
        },
        {
          $unwind: {
            path: "$profile",
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $set: {
            imgURL: {
              $toString: "$profile.imgURL",
            },
          },
        },
        {
          $unset: "profile",
        },
      ]);
      if (!doc) return res.status(204).json({ message: "No Records Found!" });
      res.status(200).json(doc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getDocByID: async (req, res) => {
    try {
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
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  toggleDocStatus: async (req, res) => {
    try {
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = loginHistoryController;

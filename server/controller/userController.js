const User = require("../model/User");
const bcrypt = require("bcrypt");
const sendMail = require("../helper/sendMail");
const createToken = require("../helper/createToken");
const generateCredential = require("../helper/generateCredential");
const ROLES_LIST = require("../config/role_list");
const isEmail = (str) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(str);
const isNumber = (str) => /^[0-9]*$/.test(str);
const userController = {
  // * Create new User
  createDoc: async (req, res) => {
    let emptyFields = [];
    let checkIfExists = 1;
    let genUsername;
    try {
      // * Retrieve information from client request body
      const {
        userType,
        firstName,
        middleName,
        lastName,
        gender,
        email,
        dateOfBirth,
      } = req.body;
      if (!userType) emptyFields.push("User Type");
      if (!ROLES_LIST.includes(userType)) emptyFields.push("Invalid User Type");
      if (!email) emptyFields.push("Email");
      if (!isEmail(email)) emptyFields.push("Invalid email");
      if (!firstName) emptyFields.push("First Name");
      if (!lastName) emptyFields.push("Last Name");
      if (!gender) emptyFields.push("Gender");
      if (!dateOfBirth) emptyFields.push("Birthday");
      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });

      // * Check if the Username email exists in User Collections
      const duplicate = await User.findOne({ email }).exec();
      if (duplicate)
        return res.status(409).json({ message: "Duplicate email" });

      const doc = await User.find().exec();
      do {
        genUsername = generateCredential.username(10);
        checkIfExists =
          doc &&
          doc.filter((filter) => {
            return filter.username === genUsername;
          }).length;
      } while (checkIfExists > 0);

      const genPassword = generateCredential.password(12);

      // * Create an User Object
      const docObject = {
        username: genUsername,
        password: genPassword,
        firstName,
        middleName,
        lastName,
        gender,
        email,
        userType,
        dateOfBirth,
      };
      const activationToken = createToken.activation(docObject);
      const url = `${process.env.BASE_URL}/#/auth/activate/${activationToken}`;
      sendMail.sendNewUser(
        email,
        url,
        "Verify your account",
        genUsername,
        genPassword,
        userType
      );
      res.status(200).json({
        message:
          "A verification has been sent to user email, Please check email's inbox or spam mail.",
      });
    } catch (error) {
      console.log(
        "🚀 ~ file: userController.js:65 ~ createDoc: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  // * Get all User
  getAllDoc: async (req, res) => {
    try {
      const response = await User.find()
        .select("-password")
        .sort({ empID: -1 });
      if (!response || response.length <= 0)
        return res.status(204).json({ message: "No records found!" });
      res.json(response);
    } catch (error) {
      console.log(
        "🚀 ~ file: UserController.jsx:49 ~ getAllDoc: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  // * Get an User
  getDocByID: async (req, res) => {
    try {
      if (!req.params.username)
        return res.status(400).json({ message: "Username is required!" });
      const username = req.params.username;
      if (!isNumber(username))
        return res.status(400).json({ message: "Invalid Username!" });

      const doc = await User.findOne({ username }).select("-password").exec();
      if (!doc)
        return res
          .status(400)
          .json({ message: `Username [${username}] not found!` });
      res.json(doc);
    } catch (error) {
      console.log(
        "🚀 ~ file: userController.js:114 ~ getDocByID: ~ error",
        error
      );

      res.status(500).json({ message: error.message });
    }
  },
  // * Update an User
  updateDocByID: async (req, res) => {
    try {
      if (!req.params.username)
        return res.status(400).json({ message: "Username is required!" });
      const username = req?.params?.username;
      const {
        userType,
        firstName,
        middleName,
        lastName,
        gender,
        email,
        dateOfBirth,
      } = req.body;
      const findDoc = await User.findOne({ username }).exec();
      if (!findDoc)
        return res
          .status(204)
          .json({ message: `Username [${username}] does not exists!` });
      const docObject = {
        userType,
        firstName,
        middleName,
        lastName,
        gender,
        email,
        dateOfBirth,
      };
      const update = await User.findOneAndUpdate({ username }, docObject);
      if (!update)
        return res.status(400).json({ message: "User update failed!" });
      res.json(update);
    } catch (error) {
      console.log(
        "🚀 ~ file: userController.js:147 ~ updateDocByID: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  // * Delete an User
  deleteDocByID: async (req, res) => {
    if (!req.params.username)
      return res.status(400).json({ message: "Username is required!" });
    try {
      const username = req.params.username;
      const doc = await User.findOne({ username }).exec();
      if (!doc)
        return res
          .status(400)
          .json({ message: `Username [${username}] not found!` });
      const deleteDoc = await doc.deleteOne({ username });
      res.json(deleteDoc);
    } catch (error) {
      console.log(
        "🚀 ~ file: userController.js:201 ~ deleteDocByID: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  // * Toggle an User status
  toggleDocStatus: async (req, res) => {
    if (!req?.params?.username)
      return res.status(400).json({ message: `Username is required` });
    try {
      const username = req.params.username;
      const { status } = req.body;
      console.log(
        "🚀 ~ file: userController.js:192 ~ toggleDocStatus: ~ status",
        status
      );

      if (status !== true && status !== false)
        return res.status(400).json({ message: "Invalid Status" });
      const doc = await User.findOne({ username }).exec();
      if (!doc)
        return res
          .status(204)
          .json({ message: `Username [${username}] not found!` });
      const update = await User.findOneAndUpdate(
        { username },
        {
          status,
        }
      );
      if (!update) {
        return res.status(400).json({ message: "User update failed!" });
      }
      console.log(update);
      res.status(200).json(update);
    } catch (error) {
      console.log(
        "🚀 ~ file: userController.js:231 ~ toggleDocStatus: ~ error",
        error
      );

      res.status(500).json({ message: error.message });
    }
  },
  // *
  updateEmployeeIMG: async (req, res) => {
    try {
      if (!req?.params?.username) {
        return res.status(400).json({ message: "Username  is required!" });
      }
      const username = req.params.username;
      const { imgURL } = req.body;
      console.log(imgURL);
      if (!imgURL) {
        return console.log("wala iamge");
      }
      if (!imgURL) {
        return res.status(400).json({ message: "Image URL is required!" });
      }
      const response = await User.findOne({
        username,
      }).exec();

      if (!response) {
        return res.status(204).json({ message: "User doesn't exists!" });
      }

      const empObject = {
        username,
        imgURL,
      };
      const update = await User.findOneAndUpdate(
        { username },
        {
          $set: { imgURL: empObject.imgURL },
        }
      );
      console.log(update);
      if (!update) {
        return res.status(400).json({ error: "No User" });
      }
      //const result = await response.save();
      res.json(update);
    } catch (error) {
      console.log(
        "🚀 ~ file: UserController.js:341 ~ updateEmployeeIMG: ~ error",
        error
      );
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;

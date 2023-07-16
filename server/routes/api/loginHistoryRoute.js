const express = require("express");
const router = express.Router();
const loginHistoryController = require("../../controller/loginHistoryController");
router.get("/", loginHistoryController.getAllDoc);
module.exports = router;

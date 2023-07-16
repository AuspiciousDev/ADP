const express = require("express");
const router = express.Router();
const scheduleController = require("../../controller/scheduleController");

router.get("/", scheduleController.getAllDoc);
router.patch("/update/:scheduleID", scheduleController.updateDocByID);
router.get("/search/:scheduleID", scheduleController.getDocByID);
router.post("/register", scheduleController.createDoc);
router.delete("/delete/:scheduleID", scheduleController.deleteDocByID);
router.patch("/status/:scheduleID", scheduleController.toggleDocStatus);

module.exports = router;

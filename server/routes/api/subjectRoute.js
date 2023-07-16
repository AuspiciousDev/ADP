const express = require("express");
const router = express.Router();
const subjectController = require("../../controller/subjectController");

router.get("/", subjectController.getAllDoc);
router.patch("/update/:subjectID", subjectController.updateDocByID);
router.get("/search/:subjectID", subjectController.getDocByID);
router.post("/register", subjectController.createDoc);
router.delete("/delete/:subjectID", subjectController.deleteDocByID);
router.patch("/status/:subjectID", subjectController.toggleDocStatus);

module.exports = router;

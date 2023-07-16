const express = require("express");
const router = express.Router();
const sectionController = require("../../controller/sectionController");

router.get("/", sectionController.getAllDoc);
router.patch("/update/:sectionID", sectionController.updateDocByID);
router.get("/search/:sectionID", sectionController.getDocByID);
router.post("/register", sectionController.createDoc);
router.delete("/delete/:sectionID", sectionController.deleteDocByID);
router.patch("/status/:sectionID", sectionController.toggleDocStatus);

module.exports = router;

const express = require("express");
const router = express.Router();
const teacherController = require("../../controller/teacherController");

router.get("/", teacherController.getAllDoc);
router.patch("/update/:empID", teacherController.updateDocByID);
router.get("/search/:empID", teacherController.getDocByID);
router.post("/register", teacherController.createDoc);
router.delete("/delete/:empID", teacherController.deleteDocByID);
router.patch("/status/:empID", teacherController.toggleDocStatus);

module.exports = router;

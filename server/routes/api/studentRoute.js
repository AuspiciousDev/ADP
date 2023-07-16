const express = require("express");
const router = express.Router();
const studentController = require("../../controller/studentController");

router.get("/", studentController.getAllDoc);
router.get("/:LRN", studentController.getDocByID);
router.post("/register", studentController.createDoc);
router.delete("/delete/:LRN", studentController.deleteDocByID);
router.patch("/update/:LRN", studentController.updateDocByID);
router.patch("/status/:LRN", studentController.toggleDocStatus);

module.exports = router;

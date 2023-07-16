const express = require("express");
const router = express.Router();
const enrolledController = require("../../controller/enrolledController");

router.get("/", enrolledController.getAllDoc);
router.post("/verify/", enrolledController.checkIfEnrolled);
router.get("/search/:enrollmentID", enrolledController.getDocByID);
router.post("/register", enrolledController.createDoc);
router.post("/register/bulk", enrolledController.createBulkDoc);
router.patch("/update/:enrollmentID", enrolledController.updateDocByID);
router.patch("/status/:enrollmentID", enrolledController.toggleDocStatus);
router.delete("/delete/:enrollmentID", enrolledController.deleteDocByID);

module.exports = router;

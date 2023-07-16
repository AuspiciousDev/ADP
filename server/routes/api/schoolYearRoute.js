const express = require("express");
const router = express.Router();
const schoolYearController = require("../../controller/schoolYearController");

router.get("/", schoolYearController.getAllDoc);
router.get("/search/:schoolYearID", schoolYearController.getDocByID);
router.post("/register", schoolYearController.createDoc);
router.delete("/delete/:schoolYearID", schoolYearController.deleteDocByID);
router.patch("/status/:schoolYearID", schoolYearController.toggleDocStatus);
router.get("/status/active", schoolYearController.getDocActive);

module.exports = router;

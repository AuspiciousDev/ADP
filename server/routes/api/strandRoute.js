const express = require("express");
const router = express.Router();
const strandController = require("../../controller/strandController");

router.get("/", strandController.getAllDoc);
router.patch("/update/:strandID", strandController.updateDocByID);
router.get("/search/:strandID", strandController.getDocByID);
router.post("/register", strandController.createDoc);
router.delete("/delete/:strandID", strandController.deleteDocByID);
router.patch("/status/:strandID", strandController.toggleDocStatus);

module.exports = router;

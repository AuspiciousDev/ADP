const express = require("express");
const router = express.Router();
const levelController = require("../../controller/levelController");

router.get("/", levelController.getAllDoc);
router.patch("/update/:levelID", levelController.updateDocByID);
router.get("/search/:levelID", levelController.getDocByID);
router.post("/register", levelController.createDoc);
router.delete("/delete/:levelID", levelController.deleteDocByID);
router.patch("/status/:levelID", levelController.toggleDocStatus);

module.exports = router;

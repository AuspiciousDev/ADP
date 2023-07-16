const express = require("express");
const router = express.Router();
const userController = require("../../controller/userController");

router.get("/", userController.getAllDoc);
router.get("/:username", userController.getDocByID);
router.post("/register", userController.createDoc);
router.delete("/delete/:username", userController.deleteDocByID);
router.patch("/update/:username", userController.updateDocByID);
router.patch("/status/:username", userController.toggleDocStatus);
router.patch("/update/img/:username", userController.updateEmployeeIMG);
module.exports = router;

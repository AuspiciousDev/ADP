const express = require("express");
const router = express.Router();
const departmentController = require("../../controller/departmentController");

router.get("/", departmentController.getAllDoc);
router.patch("/update/:depID", departmentController.updateDocByID);
router.get("/search/:depID", departmentController.getDocByID);
router.post("/register", departmentController.createDoc);
router.delete("/delete/:depID", departmentController.deleteDocByID);
router.patch("/status/:depID", departmentController.toggleDocStatus);

module.exports = router;

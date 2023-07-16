const express = require("express");
const router = express.Router();
const employeeController = require("../../controller/employeeController");

router.get("/", employeeController.getAllDoc);
router.get("/search/:empID", employeeController.getDocByID);
router.post("/register", employeeController.createDoc);
router.patch("/update/:empID", employeeController.updateDocByID);
router.patch("/status/:empID", employeeController.toggleDocStatus);
router.delete("/delete/:empID", employeeController.deleteDocByID);

module.exports = router;

const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/dustbinMess.controller");

router.get("/" , controller.index);
router.delete("/deleteMulti" , controller.deleteMulti);
router.delete("/delete/:id" , controller.deleteMessenger);
module.exports = router;
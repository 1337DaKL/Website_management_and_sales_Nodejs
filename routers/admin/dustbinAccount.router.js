const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/dustbinAccount.controller.js");


router.get("/", controller.index);
router.patch("/restore/:id", controller.restoreAccount);
router.delete("/delete/:id", controller.deleteAccount);
router.patch("/change-multi", controller.changeMulti);
module.exports = router;
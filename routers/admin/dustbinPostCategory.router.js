const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/dustbinPostCategory.controller.js");


router.get("/", controller.index);
router.patch("/restore/:id" , controller.restorePostCategory);
router.delete("/delete/:id" , controller.deletePostCategory);
module.exports = router;